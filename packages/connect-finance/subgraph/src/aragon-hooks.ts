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
  if (
    appId ==
    '0xbf8491150dafc5dcaee5b861414dca922de09ccffa344964ae167212e8c673ae'
  ) {
    return 'Finance'
  } else {
    return null
  }
}

export function onOrgTemplateCreated(orgAddress: Address): void {}
export function onAppTemplateCreated(
  appAddress: Address,
  appId: string
): void {}
export function onTokenTemplateCreated(tokenAddress: Address): void {}
