import { Address } from '@aragon/connect-types'
import {
  Contract,
  providers as ethersProviders,
  utils as ethersUtils,
} from 'ethers'

import { erc20ABI, forwarderAbi, forwarderFeeAbi } from './abis'
import App from '../entities/App'
import Transaction from '../entities/Transaction'
import { TokenData } from '../types'

export async function createDirectTransaction(
  sender: Address,
  destination: Address,
  methodAbiFragment: ethersUtils.FunctionFragment,
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
  const appInterface = app.interface()
  const functionFragment = appInterface.getFunction(methodSignature)

  return createDirectTransaction(sender, app.address, functionFragment, params)
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

export async function buildApprovePretransaction(
  transaction: Transaction,
  tokenData: TokenData,
  provider: ethersProviders.Provider
): Promise<Transaction | undefined> {
  // Token allowance pretransactionn
  const { from, to } = transaction
  const { address: tokenAddress, value: tokenValue, spender } = tokenData

  // Approve the transaction destination unless an spender is passed to approve a different contract
  const approveSpender = spender || to

  const tokenContract = new Contract(tokenAddress, erc20ABI, provider)
  const balance = await tokenContract.balanceOf(from)
  const tokenValueBN = BigInt(tokenValue)

  if (BigInt(balance) < tokenValueBN) {
    throw new Error(
      `Balance too low. ${from} balance of ${tokenAddress} token is ${balance} (attempting to send ${tokenValue})`
    )
  }

  const allowance = await tokenContract.allowance(from, approveSpender)
  const allowanceBN = BigInt(allowance)
  // If allowance is already greater than or equal to amount, there is no need to do an approve transaction
  if (allowanceBN < tokenValueBN) {
    if (allowanceBN > BigInt(0)) {
      // TODO: Actually handle existing approvals (some tokens fail when the current allowance is not 0)
      console.warn(
        `${from} already approved ${approveSpender}. In some tokens, approval will fail unless the allowance is reset to 0 before re-approving again.`
      )
    }

    const erc20 = new ethersUtils.Interface(erc20ABI)

    return new Transaction({
      from,
      to: tokenAddress,
      data: erc20.encodeFunctionData('approve', [approveSpender, tokenValue]),
    })
  }

  return undefined
}

export async function buildForwardingFeePretransaction(
  forwardingTransaction: Transaction,
  provider: ethersProviders.Provider
): Promise<Transaction | undefined> {
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
    // Needs a token approval pretransaction
    const tokenData: TokenData = {
      address: feeDetails.tokenAddress,
      spender: forwarderAddress, // since it's a forwarding transaction, always show the real spender
      value: feeDetails.amount.toString(),
    }

    return buildApprovePretransaction(
      forwardingTransaction,
      tokenData,
      provider
    )
  }
  return undefined
}
