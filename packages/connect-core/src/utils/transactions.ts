import {
  Contract,
  providers as ethersProviders,
  utils as ethersUtils,
} from 'ethers'
import { erc20ABI, forwarderAbi, forwarderFeeAbi } from './abis'
import { isFullMethodSignature } from './app'
import { FunctionFragment } from '../types'
import App from '../entities/App'

export interface Transaction {
  data: string
  from?: string
  to: string
}

export interface TransactionWithTokenData extends Transaction {
  token: {
    address: string
    value: string
    spender: string
  }
}

export async function createDirectTransaction(
  sender: string,
  destination: string,
  methodAbiFragment: FunctionFragment,
  params: any[]
): Promise<Transaction> {
  let transactionOptions = {}

  // If an extra parameter has been provided, it is the transaction options if it is an object
  if (
    methodAbiFragment.inputs.length + 1 === params.length &&
    typeof params[params.length - 1] === 'object'
  ) {
    const options = params.pop()
    transactionOptions = { ...transactionOptions, ...options }
  }

  const ethersInterface = new ethersUtils.Interface([methodAbiFragment])

  // The direct transaction we eventually want to perform
  return {
    ...transactionOptions, // Options are overwriten by the values below
    from: sender,
    to: destination,
    data: ethersInterface.encodeFunctionData(
      ethersUtils.FunctionFragment.from(methodAbiFragment),
      params
    ),
  }
}

export async function createDirectTransactionForApp(
  sender: string,
  app: App,
  methodSignature: string,
  params: any[]
): Promise<Transaction> {
  if (!app) {
    throw new Error(`Could not create transaction due to missing app artifact`)
  }

  const destination = app.address

  if (!app.abi) {
    throw new Error(`No ABI specified in artifact for ${destination}`)
  }

  const methodAbiFragment = app.abi.find((method) => {
    // If the full signature isn't given, just find the first overload declared
    if (!isFullMethodSignature(methodSignature)) {
      return method.name === methodSignature
    }

    // Fallback functions don't have inputs in the ABI
    const currentParameterTypes = Array.isArray(method.inputs)
      ? method.inputs.map(({ type }) => type)
      : []
    const currentMethodSignature = `${method.name}(${currentParameterTypes.join(
      ','
    )})`
    return currentMethodSignature === methodSignature
  })

  if (!methodAbiFragment) {
    throw new Error(`${methodSignature} not found on ABI for ${destination}`)
  }

  return createDirectTransaction(
    sender,
    destination,
    methodAbiFragment as FunctionFragment,
    params
  )
}

export function createForwarderTransactionBuilder(
  sender: string,
  directTransaction: Transaction
): Function {
  const forwarder = new ethersUtils.Interface(forwarderAbi)

  return (forwarderAddress: string, script: string): Transaction => ({
    ...directTransaction, // Options are overwriten by the values below
    from: sender,
    to: forwarderAddress,
    data: forwarder.encodeFunctionData('forward', [script]),
  })
}

export async function buildPretransaction(
  transaction: TransactionWithTokenData,
  provider: ethersProviders.Provider
): Promise<Transaction | undefined> {
  // Token allowance pretransactionn
  const {
    from,
    to,
    token: { address: tokenAddress, value: tokenValue, spender },
  } = transaction

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

    return {
      from,
      to: tokenAddress,
      data: erc20.encodeFunctionData('approve', [approveSpender, tokenValue]),
    }
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
    const forwardingTxWithTokenData: TransactionWithTokenData = {
      ...forwardingTransaction,
      token: {
        address: feeDetails.tokenAddress,
        spender: forwarderAddress, // since it's a forwarding transaction, always show the real spender
        value: feeDetails.amount.toString(),
      },
    }

    return buildPretransaction(forwardingTxWithTokenData, provider)
  }
  return undefined
}
