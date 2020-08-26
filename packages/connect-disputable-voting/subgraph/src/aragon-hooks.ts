import { Address } from '@graphprotocol/graph-ts'

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
  const AGREEMENT_OPEN = '0x34c62f3aec3073826f39c2c35e9a1297d9dbf3cc77472283106f09eee9cf47bf'
  const AGREEMENT_PRECEDENCE_CAMPAIGN = '0x15a969a0e134d745b604fb43f699bb5c146424792084c198d53050c4d08126d1'

  const VOTING_OPEN = '0x705b5084c67966bb8e4640b28bab7a1e51e03d209d84e3a04d2a4f7415f93b34'
  const VOTING_PRECEDENCE_CAMPAIGN = '0x39aa9e500efe56efda203714d12c78959ecbf71223162614ab5b56eaba014145'

  if (appId == AGREEMENT_OPEN || appId == AGREEMENT_PRECEDENCE_CAMPAIGN) {
    return 'Agreement'
  } else if (appId == VOTING_OPEN || appId == VOTING_PRECEDENCE_CAMPAIGN) {
    return 'DisputableVoting'
  } else {
    return null
  }
}

export function onOrgTemplateCreated(orgAddress: Address): void {}
export function onAppTemplateCreated(appAddress: Address, appId: string): void {}
export function onTokenTemplateCreated(tokenAddress: Address): void {}
