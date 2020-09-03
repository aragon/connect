import * as radspec from 'radspec'
import { providers as ethersProviders } from 'ethers'

import { addressesEqual } from '../address'
import { findAppMethodFromData } from '../app'
import { filterAndDecodeAppUpgradeIntents } from '../intent'
import { Abi, AppMethod, StepDecoded, StepDescribed } from '../../types'
import App from '../../entities/App'

interface FoundMethod {
  method?: AppMethod
  abi?: Abi
}

/**
 * Attempt to describe intent via radspec.
 */
export async function tryEvaluatingRadspec(
  intent: StepDecoded,
  installedApps: App[],
  provider: ethersProviders.Provider // Decorated intent with description, if one could be made
): Promise<StepDescribed> {
  const app = installedApps.find((app) =>
    addressesEqual(app.address, intent.to)
  )

  // If the intent matches an installed app, use only that app to search for a
  // method match, otherwise fallback to searching all installed apps
  const appsToSearch = app ? [app] : installedApps
  const foundMethod = appsToSearch.reduce<FoundMethod | undefined>(
    (found, app) => {
      if (found) {
        return found
      }

      const method = findAppMethodFromData(app, intent.data)
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

  return { ...intent, description: evaluatedNotice }
}

/**
 * Attempt to describe a setApp() intent. Only describes the APP_BASE namespace.
 *
 * @param  {Object} intent transaction intent
 * @param  {Object} wrapper
 * @return {Promise<Object>} Decorated intent with description, if one could be made
 */
export async function tryDescribingUpdateAppIntent(
  intent: StepDecoded,
  installedApps: App[]
): Promise<StepDescribed | undefined> {
  const upgradeIntentParams = filterAndDecodeAppUpgradeIntents(
    [intent],
    installedApps
  )[0]
  if (Array.isArray(upgradeIntentParams) && upgradeIntentParams.length === 0)
    return undefined

  const { appId, appAddress } = upgradeIntentParams

  const app = installedApps.find((app) => app.address === appAddress)

  const repo = await app?.repo()

  return {
    ...intent,
    description: `Upgrade ${appId} app instances to v${repo?.lastVersion}`,
  }
}

export { postprocessRadspecDescription } from './postprocess'
