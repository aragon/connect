import { Address, Bytes, log } from '@graphprotocol/graph-ts'

import { ENS } from '../../generated/templates/Kernel/ENS'
import { PublicResolver } from '../../generated/templates/Kernel/PublicResolver'

const ENS_ADDRESS = '{{ens}}'

export function resolveRepo(appId: Bytes): string | null {
  const ens = ENS.bind(Address.fromString(ENS_ADDRESS))

  let callEnsResult = ens.try_resolver(appId)
  if (callEnsResult.reverted) {
    log.info('ens resolver reverted', [])
  } else {
    const resolver = PublicResolver.bind(callEnsResult.value)
    let callResolverResult = resolver.try_addr(appId)
    if (callResolverResult.reverted) {
      log.info('resolver addr reverted', [])
    } else {
      return callResolverResult.value.toHex()
    }
  }
  return null
}
