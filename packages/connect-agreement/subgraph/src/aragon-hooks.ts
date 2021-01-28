import { Address, log } from '@graphprotocol/graph-ts'

/*
 * Called when an app proxy is detected.
 *
 * Return the name of a data source template if you would like to create it for a given appId.
 * Return null otherwise.
 *
 * The returned name is used to instantiate a template declared in the subgraph manifest file,
 * which must have the same name.
 */
export function getTemplateForApp(appAddress: Address): string | null {
  const AGREEMENT_ADDRESS = Address.fromString('0x8a9893db28fe41bcafc07c9c4da73a6a85d3732c')
  const STAKING_ADDRESS = Address.fromString('0xe5d38ff3b8bee1d69049fa0dac41a98446746f0b')

  if (AGREEMENT_ADDRESS.equals(appAddress)) {
    return 'Agreement'
  } else {
    if (STAKING_ADDRESS.equals(appAddress)) {
      return 'Staking'
    } else {
        return null
    }
  }
}

export function onOrgTemplateCreated(orgAddress: Address): void {}
export function onAppTemplateCreated(appAddress: Address, appId: string): void {}
export function onTokenTemplateCreated(tokenAddress: Address): void {}
