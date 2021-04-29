import type { Address } from '@1hive/connect-types'
import { Result } from '@ethersproject/abi'
import { Provider } from '@ethersproject/providers'

import { addressesEqual } from './address'
import {
  decodeKernelSetAppParameters,
  isKernelAppCodeNamespace,
  isKernelSetAppIntent,
} from './kernel'
import { getForwardingPath, getACLForwardingPath } from './path/index'
import { StepDecoded } from '../types'
import App from '../entities/App'
import ForwardingPath from '../entities/ForwardingPath'

export async function appIntent(
  sender: Address,
  destinationApp: App,
  methodSignature: string,
  params: any[],
  installedApps: App[],
  provider: Provider
): Promise<ForwardingPath> {
  const acl = installedApps.find((app) => app.name === 'acl')

  if (acl && addressesEqual(destinationApp.address, acl.address)) {
    try {
      return getACLForwardingPath(
        sender,
        acl,
        methodSignature,
        params,
        installedApps,
        provider
      )
    } catch (_) {
      // emtpy path
      return new ForwardingPath(
        {
          destination: destinationApp,
          path: [],
          transactions: [],
        },
        installedApps,
        provider
      )
    }
  }

  return getForwardingPath(
    sender,
    destinationApp,
    methodSignature,
    params,
    installedApps,
    provider
  )
}

export function filterAndDecodeAppUpgradeIntents(
  intents: StepDecoded[],
  installedApps: App[]
): Result[] {
  const kernel = installedApps.find((app) => app.name === 'kernel')

  if (!kernel) {
    throw new Error(`Organization not found.`)
  }

  return (
    intents
      // Filter for setApp() calls to the kernel
      .filter((intent) => isKernelSetAppIntent(kernel, intent))
      // Try to decode setApp() params
      .map((intent) => {
        try {
          return decodeKernelSetAppParameters(intent.data)
          // eslint-disable-next-line no-empty
        } catch (_) {}

        return []
      })
      // Filter for changes to APP_BASES_NAMESPACE
      .filter((result) => isKernelAppCodeNamespace(result['namesapce']))
  )
}
