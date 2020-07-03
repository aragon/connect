import { ethers } from 'ethers'

import App from '../entities/App'
import TransactionRequest, {
  TransactionRequestData,
} from '../transactions/TransactionRequest'
import { decodeTransactionPath } from './path/decodePath'
import {
  tryEvaluatingRadspec,
  postprocessRadspecDescription,
} from './radspec/index'

export async function describeTransaction(
  transaction: TransactionRequestData,
  apps: App[],
  provider?: ethers.providers.Provider
): Promise<TransactionRequest> {
  if (!transaction.to) {
    throw new Error(`Could not describe transaction: missing 'to'`)
  }
  if (!transaction.data) {
    throw new Error(`Could not describe transaction: missing 'data'`)
  }

  let description, descriptionAnnotated
  try {
    const decoratedTransaction = await tryEvaluatingRadspec(
      transaction,
      apps,
      provider
    )
    description = decoratedTransaction.description
    // eslint-disable-next-line no-empty
  } catch (_) {}

  if (description) {
    try {
      const processed = await postprocessRadspecDescription(description, apps)
      descriptionAnnotated = processed.annotatedDescription
      description = processed.description
      // eslint-disable-next-line no-empty
    } catch (_) {}
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
  path: TransactionRequestData[],
  apps: App[],
  provider?: ethers.providers.Provider
): Promise<TransactionRequestData[]> {
  return Promise.all(
    path.map(async step => {
      let decoratedStep

      // Evaluate via radspec normally
      try {
        decoratedStep = await tryEvaluatingRadspec(step, apps, provider)
        // eslint-disable-next-line no-empty
      } catch (err) {}

      // Annotate the description, if one was found
      if (decoratedStep) {
        if (decoratedStep.description) {
          try {
            const processed = await postprocessRadspecDescription(
              decoratedStep.description,
              apps
            )
            decoratedStep.description = processed.description
            decoratedStep.descriptionAnnotated = processed.annotatedDescription
            // eslint-disable-next-line no-empty
          } catch (err) {}
        }

        if (decoratedStep.children) {
          decoratedStep.children = await describeTransactionPath(
            decoratedStep.children,
            apps,
            provider
          )
        }
      }

      return decoratedStep || step
    })
  )
}

export async function describeScript(
  script: string,
  apps: App[],
  provider?: ethers.providers.Provider
): Promise<TransactionRequest[]> {
  const path = decodeTransactionPath(script)

  const describedPath = await describeTransactionPath(path, apps, provider)

  return describedPath.map(tx => new TransactionRequest(tx))
}
