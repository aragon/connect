import { Address } from '@aragon/connect-types'
import { utils as ethersUtils, providers as ethersProvider } from 'ethers'

import App from '../entities/App'
import ForwardingPath from '../entities/ForwardingPath'
import { AppOrAddress, StepDecoded } from '../types'
import { describePath } from './descriptor/index'
import { getForwardingPath, getACLForwardingPath } from './path/index'
import { addressesEqual, normalizeAddress } from './address'
import { normalizeApp } from './app'
import { createDirectTransaction } from './transactions'
import {
  decodeKernelSetAppParameters,
  isKernelAppCodeNamespace,
  isKernelSetAppIntent,
} from './kernel'

export async function organizationIntent(
  sender: Address,
  destination: AppOrAddress,
  methodAbiFragment: ethersUtils.FunctionFragment,
  params: any[],
  installedApps: App[],
  provider: ethersProvider.Provider
): Promise<ForwardingPath | undefined> {
  const acl = installedApps.find((app) => app.appName === 'acl.aragonpm.eth')!
  const destinationAddress = normalizeAddress(destination)

  // TODO: Add Disputable Forwarding Path
  if (addressesEqual(destinationAddress, acl.address)) {
    try {
      return getACLForwardingPath(
        sender,
        acl,
        methodAbiFragment.name,
        params,
        installedApps,
        provider
      )
    } catch (_) {
      return undefined
    }
  }

  const destinationApp = normalizeApp(destination, installedApps)

  if (destinationApp) {
    // Destination is an installed app; need to go through normal transaction pathing
    return getForwardingPath(
      sender,
      destinationApp,
      methodAbiFragment.name,
      params,
      installedApps,
      provider
    )
  }

  // Destination is not an installed app on this org, just create a direct transaction
  // with the acting account
  try {
    const tx = await createDirectTransaction(
      sender,
      destinationAddress,
      methodAbiFragment,
      params
    )

    return new ForwardingPath(
      {
        destination,
        description: await describePath([tx], installedApps, provider),
        transactions: [tx],
      },
      provider
    )
  } catch (_) {
    return undefined
  }
}

export async function appIntent(
  sender: Address,
  app: App,
  methodSignature: string,
  params: any[],
  installedApps: App[],
  provider: ethersProvider.Provider
): Promise<ForwardingPath | undefined> {
  const acl = installedApps.find((app) => app.appName === 'acl.aragonpm.eth')!

  // TODO: Add Disputable Forwarding Path
  if (addressesEqual(app.address, acl.address)) {
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
      return undefined
    }
  }

  return getForwardingPath(
    sender,
    app,
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
  const kernelApp = installedApps.find(
    (app) => app.appName === 'kernel.aragonpm.eth'
  )!

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
