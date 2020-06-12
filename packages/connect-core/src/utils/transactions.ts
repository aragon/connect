import { ethers } from 'ethers'

import { erc20ABI, forwarderAbi, forwarderFeeAbi } from './abis'
import { isFullMethodSignature } from './app'
import { Abi, FunctionFragment } from '../types'
import Application from '../entities/Application'
import { TransactionRequestData } from '../transactions/TransactionRequest'

const DEFAULT_GAS_FUZZ_FACTOR = '1.5'
const PREVIOUS_BLOCK_GAS_LIMIT_FACTOR = '0.95'

export interface TransactionWithTokenData extends TransactionRequestData {
  token?: {
    address: string
    value: string
    spender: string
  }
}

export async function applyPretransaction(
  transaction: TransactionWithTokenData,
  provider: ethers.providers.Provider
): Promise<TransactionRequestData> {
  if (transaction.token) {
    // Token allowance pretransactionn
    const {
      from,
      to,
      token: { address: tokenAddress, value: tokenValue, spender },
    } = transaction

    // Approve the transaction destination unless an spender is passed to approve a different contract
    const approveSpender = spender || to

    const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, provider)
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

      const erc20 = new ethers.utils.Interface(erc20ABI)

      const tokenApproveTransaction = {
        // TODO: should we include transaction options?
        from,
        to: tokenAddress,
        data: erc20.encodeFunctionData('approve', [approveSpender, tokenValue]),
      }

      delete transaction.token

      return {
        ...transaction,
        pretransaction: tokenApproveTransaction,
      }
    }
  }

  return transaction
}

export async function createDirectTransaction(
  sender: string,
  destination: string,
  abi: Abi,
  methodJsonDescription: FunctionFragment,
  params: any[],
  provider: ethers.providers.Provider
): Promise<TransactionRequestData> {
  let transactionOptions = {}

  // If an extra parameter has been provided, it is the transaction options if it is an object
  if (
    methodJsonDescription.inputs.length + 1 === params.length &&
    typeof params[params.length - 1] === 'object'
  ) {
    const options = params.pop()
    transactionOptions = { ...transactionOptions, ...options }
  }

  const ethersInterface = new ethers.utils.Interface(abi)

  // The direct transaction we eventually want to perform
  const directTransaction = {
    ...transactionOptions, // Options are overwriten by the values below
    from: sender,
    to: destination,
    data: ethersInterface.encodeFunctionData(
      methodJsonDescription.name,
      params
    ),
  }

  return applyPretransaction(directTransaction, provider)
}

export async function createDirectTransactionForApp(
  sender: string,
  app: Application,
  methodSignature: string,
  params: any[],
  provider: ethers.providers.Provider
): Promise<TransactionRequestData> {
  if (!app) {
    throw new Error(`Could not create transaction due to missing app artifact`)
  }

  const destination = app.address

  if (!app.abi) {
    throw new Error(`No ABI specified in artifact for ${destination}`)
  }

  const methodJsonDescription = app.abi.find((method) => {
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

  if (!methodJsonDescription) {
    throw new Error(`${methodSignature} not found on ABI for ${destination}`)
  }

  return createDirectTransaction(
    sender,
    destination,
    app.abi,
    methodJsonDescription as FunctionFragment,
    params,
    provider
  )
}

export function createForwarderTransactionBuilder(
  sender: string,
  directTransaction: TransactionRequestData
): Function {
  const forwarder = new ethers.utils.Interface(forwarderAbi)

  return (
    forwarderAddress: string,
    script: string
  ): TransactionRequestData => ({
    ...directTransaction, // Options are overwriten by the values below
    from: sender,
    to: forwarderAddress,
    data: forwarder.encodeFunctionData('forward', [script]),
  })
}

export async function applyForwardingFeePretransaction(
  forwardingTransaction: TransactionRequestData,
  provider: ethers.providers.Provider
): Promise<TransactionRequestData> {
  const { to: forwarderAddress, from } = forwardingTransaction

  const forwarderFee = new ethers.Contract(
    forwarderAddress,
    forwarderFeeAbi,
    provider
  )

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
    return applyPretransaction(forwardingTxWithTokenData, provider)
  }

  return forwardingTransaction
}

export async function getRecommendedGasLimit(
  estimatedGasLimit: ethers.BigNumber,
  provider: ethers.providers.Provider,
  { gasFuzzFactor = DEFAULT_GAS_FUZZ_FACTOR } = {}
): Promise<ethers.BigNumber> {
  const latestBlockNumber = await provider.getBlockNumber()
  const latestBlock = await provider.getBlock(latestBlockNumber)
  const latestBlockGasLimit = latestBlock.gasLimit

  const upperGasLimit = latestBlockGasLimit.mul(
    ethers.BigNumber.from(PREVIOUS_BLOCK_GAS_LIMIT_FACTOR)
  )

  const bufferedGasLimit = estimatedGasLimit.mul(
    ethers.BigNumber.from(gasFuzzFactor)
  )

  if (estimatedGasLimit.gt(upperGasLimit)) {
    // TODO: Consider whether we should throw an error rather than returning with a high gas limit
    return estimatedGasLimit
  }
  if (bufferedGasLimit.lt(upperGasLimit)) {
    return bufferedGasLimit
  }
  return upperGasLimit
}

/**
 * Calculates and applies the gas limit and gas price for a transaction
 *
 * @param  {Object} transaction
 * @param  {bool} isForwarding
 * @return {Promise<Object>} The transaction with the gas limit and gas price added.
 *                           If the transaction fails from the estimateGas check, the promise will
 *                           be rejected with the error.
 */
export async function applyTransactionGas(
  transaction: TransactionRequestData,
  provider: ethers.providers.Provider,
  isForwarding = false
): Promise<TransactionRequestData> {
  // If a pretransaction is required for the main transaction to be performed,
  // performing web3.eth.estimateGas could fail until the pretransaction is mined
  // Example: erc20 approve (pretransaction) + deposit to vault (main transaction)`
  if (transaction.pretransaction) {
    // Calculate gas settings for pretransaction
    transaction.pretransaction = await applyTransactionGas(
      transaction.pretransaction,
      provider,
      false
    )
    // Note: for transactions with pretransactions gas limit and price cannot be calculated
    return transaction
  }

  // TODO: check with ethers keep happening
  // NOTE: estimateGas mutates the argument object and transforms the address to lowercase
  // so this is a hack to make sure checksums are not destroyed
  // Also, at the same time it's a hack for checking if the call will revert,
  // since `eth_call` returns `0x` if the call fails and if the call returns nothing.
  // So yeah...

  const estimatedGasLimit = await provider.estimateGas({
    to: transaction.to,
    data: transaction.data,
  })
  // TODO: Check if we want to keep using it
  // const recommendedGasLimit = await getRecommendedGasLimit(
  //   estimatedGasLimit,
  //   provider
  // )

  // If the gas provided in the intent is lower than the estimated gas, use the estimation
  // when forwarding as it requires more gas and otherwise the transaction would go out of gas
  if (
    !transaction.gas ||
    (isForwarding &&
      ethers.BigNumber.from(transaction.gas).lt(estimatedGasLimit))
  ) {
    transaction.gas = estimatedGasLimit.toString()
    transaction.gasLimit = estimatedGasLimit.toString()
  }

  if (!transaction.gasPrice) {
    // TODO: consider supporting an estimation function like aragon wrapper does
    transaction.gasPrice = (await provider.getGasPrice()).toString()
  }

  return transaction
}
