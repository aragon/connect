import { BigInt, Address } from '@graphprotocol/graph-ts'

import { createVault } from './Vault'

const VAULT_APP_ID = '0x7e852e0fcfce6551c13800f1e7476f982525c2b5277ba14b24339c68416336d1'
const AGENT_APP_ID = '0x9ac98dc5f995bf0211ed589ef022719d1487e5cb2bab505676f0d084c07cf89a'

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
  return (appId == VAULT_APP_ID || appId == AGENT_APP_ID) ? 'Vault' : null
}

export function onAppTemplateCreated(appAddress: Address, appId: string, timestamp: BigInt): void {
  createVault(appAddress, timestamp);
}

export function onOrgTemplateCreated(orgAddress: Address): void {}
export function onTokenTemplateCreated(tokenAddress: Address): void {}
