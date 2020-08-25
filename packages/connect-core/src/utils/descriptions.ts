import { providers as ethersProviders } from 'ethers'
import App from '../entities/App'
import TransactionRequest from '../transactions/TransactionRequest'
import {
  decodeTransactionPath,
  TransactionWithChildren,
} from './path/decodePath'
import {
  tryEvaluatingRadspec,
  postprocessRadspecDescription,
} from './radspec/index'

export async function describeTransaction(
  transaction: TransactionWithChildren,
  apps: App[],
  provider?: ethersProviders.Provider
): Promise<TransactionRequest> {
  if (!transaction.to) {
    throw new Error(`Could not describe transaction: missing 'to'`)
  }
  if (!transaction.data) {
    throw new Error(`Could not describe transaction: missing 'data'`)
  }
  let description, descriptionAnnotated
  try {
    description = await tryEvaluatingRadspec(transaction, apps, provider)

    if (description) {
      const processed = await postprocessRadspecDescription(description, apps)
      descriptionAnnotated = processed.annotatedDescription
      description = processed.description
    }

    if (transaction.children) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      transaction.children = await describeTransactionPath(
        transaction.children,
        apps,
        provider
      )
    }
  } catch (err) {
    throw new Error(`Could not describe transaction: ${err}`)
  }

  return new TransactionRequest({
    ...transaction,
    description,
    descriptionAnnotated,
  })
}

/**
 * Use radspec to create a human-readable description for each transaction in the given `path`
 *
 */
export async function describeTransactionPath(
  path: TransactionWithChildren[],
  apps: App[],
  provider?: ethersProviders.Provider
): Promise<TransactionRequest[]> {
  return Promise.all(
    path.map((step) => describeTransaction(step, apps, provider))
  )
}

export async function describeScript(
  script: string,
  apps: App[],
  provider?: ethersProviders.Provider
): Promise<TransactionRequest[]> {
  const path = decodeTransactionPath(script)

  return describeTransactionPath(path, apps, provider)
}
