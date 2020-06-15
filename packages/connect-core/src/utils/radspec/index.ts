import { ethers } from 'ethers'
import * as radspec from 'radspec'

import { addressesEqual } from '../address'
import { findAppMethodFromIntent } from '../app'
import Application from '../../entities/Application'
import { TransactionRequestData } from '../../transactions/TransactionRequest'
import { Abi, AppIntent } from '../../types'

interface FoundMethod {
  method?: AppIntent
  abi?: Abi
}

/**
 * Attempt to describe intent via radspec.
 */
export async function tryEvaluatingRadspec(
  intent: TransactionRequestData,
  apps: Application[],
  provider?: ethers.providers.Provider // Decorated intent with description, if one could be made
): Promise<TransactionRequestData> {
  const app = apps.find((app) => addressesEqual(app.address, intent.to))

  // If the intent matches an installed app, use only that app to search for a
  // method match, otherwise fallback to searching all installed apps
  const appsToSearch = app ? [app] : apps
  const foundMethod = appsToSearch.reduce<FoundMethod | undefined>(
    (found, app) => {
      if (found) {
        return found
      }

      const method = findAppMethodFromIntent(app, intent)
      if (method) {
        return {
          method,
          // This is not very nice, but some apps don't have ABIs attached to their function
          // declarations and so we have to fall back to using their full app ABI
          // TODO: define a more concrete schema around the artifact.json's `function.abi`
          abi: method.abi ? [method.abi] : app.abi,
        }
      }
    },
    undefined
  )

  const { abi, method } = foundMethod || {}

  let evaluatedNotice
  if (method && method.notice) {
    try {
      evaluatedNotice = await radspec.evaluate(
        method.notice,
        {
          abi,
          transaction: intent,
        },
        { provider: provider }
      )
    } catch (err) {
      console.error(
        `Could not evaluate a description for given transaction data: ${intent.data}`,
        err
      )
    }
  }

  return {
    ...intent,
    description: evaluatedNotice,
  }
}

export {
  postprocessRadspecDescription,
  PostProcessDescription,
} from './postprocess'
