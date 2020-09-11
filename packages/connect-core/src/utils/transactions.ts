import { Address } from '@aragon/connect-types'
import {
  Contract,
  providers as ethersProviders,
  utils as ethersUtils,
} from 'ethers'

import { erc20ABI, forwarderAbi, forwarderFeeAbi } from './abis'
import { findMethodAbiFragment } from './abi'
import { TokenData } from '../types'
import App from '../entities/App'
import Transaction from '../entities/Transaction'

export async function createDirectTransaction(
  sender: Address,
  destination: Address,
  methodAbiFragment: ethersUtils.Fragment,
  params: any[]
): Promise<Transaction> {
  if (methodAbiFragment.type === 'fallback' && params.length > 1) {
    throw new Error(
      `Could not create transaction to fallback function due to too many parameters: ${params}`
    )
  }

  // The direct transaction we eventually want to perform
  return new Transaction({
    from: sender,
    to: destination,
    data: new ethersUtils.Interface([methodAbiFragment]).encodeFunctionData(
      ethersUtils.FunctionFragment.from(methodAbiFragment),
      params
    ),
  })
}

export async function createDirectTransactionForApp(
  sender: Address,
  app: App,
  methodSignature: string,
  params: any[]
): Promise<Transaction> {
  if (!app.abi) {
    throw new Error(
      `No ABI specified in app for ${app.address}. Make sure the metada for the app is available`
    )
  }

  const fragment = findMethodAbiFragment(app.abi, methodSignature)

  if (!fragment) {
    throw new Error(`${methodSignature} not found on ABI for ${app.address}`)
  }

  return createDirectTransaction(sender, app.address, fragment, params)
}

export function createForwarderTransactionBuilder(
  sender: Address,
  directTransaction: Transaction
): Function {
  const forwarder = new ethersUtils.Interface(forwarderAbi)

  return (forwarderAddress: string, script: string): Transaction =>
    new Transaction({
      ...directTransaction, // Options are overwriten by the values below
      from: sender,
      to: forwarderAddress,
      data: forwarder.encodeFunctionData('forward', [script]),
    })
}

export async function buildApprovePreTransactions(
  transaction: Transaction,
  tokenData: TokenData,
  provider: ethersProviders.Provider
): Promise<Transaction[]> {
  // Token allowance pre-transaction
  const { from, to } = transaction
  const { address: tokenAddress, value: tokenValue, spender } = tokenData

  const tokenContract = new Contract(tokenAddress, erc20ABI, provider)
  const balance = await tokenContract.balanceOf(from)
  const tokenValueBN = BigInt(tokenValue.toString())

  if (BigInt(balance) < tokenValueBN) {
    throw new Error(
      `Balance too low. ${from} balance of ${tokenAddress} token is ${balance} (attempting to send ${tokenValue})`
    )
  }

  // Approve the transaction destination unless an spender is passed to approve a different contract
  const approveSpender = spender ?? to
  const allowance = await tokenContract.allowance(from, approveSpender)

  // If allowance is already greater than or equal to amount, there is no need to do an approve transaction
  const allowanceBN = BigInt(allowance)
  if (allowanceBN >= tokenValueBN) {
    return []
  }

  const transactions: Transaction[] = []
  const erc20 = new ethersUtils.Interface(erc20ABI)

  // If the current allowance is greater than zero, we send a first pre-transaction to set it to zero
  if (allowanceBN > BigInt(0)) {
    console.warn(
      `${from} already approved ${approveSpender} some amount, adding one extra pre-transaction to set it to zero to avoid a failing approval.`
    )
    const zeroApprovalPreTransaction = new Transaction({
      from,
      to: tokenAddress,
      data: erc20.encodeFunctionData('approve', [approveSpender, '0']),
    })
    transactions.push(zeroApprovalPreTransaction)
  }

  const requestedApprovalPreTransaction = new Transaction({
    from,
    to: tokenAddress,
    data: erc20.encodeFunctionData('approve', [approveSpender, tokenValue]),
  })

  transactions.push(requestedApprovalPreTransaction)
  return transactions
}

export async function buildForwardingFeePreTransactions(
  forwardingTransaction: Transaction,
  provider: ethersProviders.Provider
): Promise<Transaction[]> {
  const { to: forwarderAddress, from } = forwardingTransaction

  const forwarderFee = new Contract(forwarderAddress, forwarderFeeAbi, provider)

  const feeDetails = { amount: BigInt(0), tokenAddress: '' }
  try {
    const overrides = {
      from,
    }
    // Passing the EOA as `msg.sender` to the forwardFee call is useful for use cases where the fee differs relative to the account
    const [tokenAddress, amount] = await forwarderFee.forwardFee(overrides) // forwardFee() returns (address, uint256)
    feeDetails.tokenAddress = tokenAddress
    feeDetails.amount = BigInt(amount)
  } catch (err) {
    // Not all forwarders implement the `forwardFee()` interface
  }

  if (feeDetails.tokenAddress && feeDetails.amount > BigInt(0)) {
    // Needs a token approval pre-transaction
    const tokenData: TokenData = {
      address: feeDetails.tokenAddress,
      spender: forwarderAddress, // since it's a forwarding transaction, always show the real spender
      value: feeDetails.amount.toString(),
    }

    return buildApprovePreTransactions(
      forwardingTransaction,
      tokenData,
      provider
    )
  }
  return []
}
