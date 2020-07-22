import { Address } from '@graphprotocol/graph-ts'
import {
  getTokenManagerEntity,
  processOrphanTokenManagers
} from './TokenManager'

/*
 * Called when an app proxy is detected.
 *
 * Return the name of a data source template if you would like to create it for a given appId.
 * Return null otherwise.
 *
 * The returned name is used to instantiate a template declared in the subgraph manifest file,
 * which must have the same name.
 */
export function getTemplateForApp(appId: string): string | null {
  if (appId == '0x6b20a3010614eeebf2138ccec99f028a61c811b3b1a3343b6ff635985c75c91f') {
    return 'TokenManager'
  } else {
    return null
  }
}

export function onAppTemplateCreated(appAddress: Address, appId: string): void {
  getTokenManagerEntity(appAddress)
  processOrphanTokenManagers()
}

export function onOrgTemplateCreated(orgAddress: Address): void {}

export function onTokenTemplateCreated(tokenAddress: Address): void {}
