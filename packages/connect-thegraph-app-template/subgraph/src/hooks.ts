import { Address } from '@graphprotocol/graph-ts'

export function getAppId(): string {
  return '0x9fa3927f639745e587912d4b0fea7ef9013bf93fb907d29faeab57417ba6e1d4'
}

export function getAppTemplateName(): string {
  return 'Voting'
}

export function onAppTemplateCreated(orgAddress: Address, proxyAddress: Address): void {}
