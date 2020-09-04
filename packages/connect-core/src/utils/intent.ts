import { Address } from '@aragon/connect-types'
import { utils as ethersUtils, providers as ethersProvider } from 'ethers'

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
  provider: ethersProvider.Provider
): Promise<ForwardingPath> {
  const acl = installedApps.find((app) => app.name === 'acl')!

  if (addressesEqual(destinationApp.address, acl.address)) {
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
): ethersUtils.Result[] {
  const kernelApp = installedApps.find((app) => app.name === 'kernel')!

  return (
    intents
      // Filter for setApp() calls to the kernel
      .filter((intent) => isKernelSetAppIntent(kernelApp, intent))
      // Try to decode setApp() params
      .map((intent) => {
        try {
          return decodeKernelSetAppParameters(intent.data)
        } catch (_) {}

        return []
      })
      // Filter for changes to APP_BASES_NAMESPACE
      .filter((result) => isKernelAppCodeNamespace(result['namesapce']))
  )
}
