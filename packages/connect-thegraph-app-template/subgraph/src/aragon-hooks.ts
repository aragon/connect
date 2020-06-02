import { Address } from '@graphprotocol/graph-ts'

export function getAppTemplateType(appId: string): string | null {
  return null
}

export function onOrgTemplateCreated(orgAddress: Address): void {}
export function onAppTemplateCreated(appAddress: Address, appId: string): void {}
export function onTokenTemplateCreated(tokenAddress: Address): void {}
