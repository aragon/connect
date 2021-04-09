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
  //Once we start gardens we could use this appId instead of the address, leaving the address for now because the subgraph entities id are not 
  //using the app address
  // const AGREEMENT_OPEN = '0x41dd0b999b443a19321f2f34fe8078d1af95a1487b49af4c2ca57fb9e3e5331e'

  // const AGREEMENT_ADDRESS = Address.fromString('0x15d99c0ba7cd951a9cadeb9bff4d603a1af23c3c') // RINKEBY AGREEMENT
   const AGREEMENT_ADDRESS = Address.fromString('0x59a15718992a42082ab2306bc6cbd662958a178c')
  if (AGREEMENT_ADDRESS.equals(appAddress)) {
    return 'Agreement'
  } 
  return null
}

export function onOrgTemplateCreated(orgAddress: Address): void {}
export function onAppTemplateCreated(appAddress: Address, appId: string): void {}
export function onTokenTemplateCreated(tokenAddress: Address): void {}
