/* eslint-disable no-empty */
import { ethers } from 'ethers'

import Application from '../../entities/Application'
import {
  tryEvaluatingRadspec,
  postprocessRadspecDescription,
} from '../radspec/index'
import { TransactionRequestData } from '../../transactions/TransactionRequest'

/**
 * Use radspec to create a human-readable description for each transaction in the given `path`
 *
 */
export async function describeTransactionPath(
  path: TransactionRequestData[],
  apps: Application[],
  provider?: ethers.providers.Provider
): Promise<TransactionRequestData[]> {
  return Promise.all(
    path.map(async step => {
      let decoratedStep

      // Evaluate via radspec normally
      try {
        decoratedStep = await tryEvaluatingRadspec(step, apps, provider)
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
            decoratedStep.annotatedDescription = processed.annotatedDescription
          } catch (err) {}
        }
      }

      return decoratedStep || step
    })
  )
}
