import { Address, Bytes, log } from '@graphprotocol/graph-ts'

import { ENS } from '../../generated/templates/Kernel/ENS'
import { PublicResolver } from '../../generated/templates/Kernel/PublicResolver'
import { ZERO_ADDR } from './constants'

const ENS_ADDRESS = '{{ens}}'

const OLD_ENS_ADDRESS = '{{ens_old}}'

export function resolveRepo(appId: Bytes): Address {
  let ens = ENS.bind(Address.fromString(ENS_ADDRESS))

  let callEnsResult = ens.try_resolver(appId)
  if (callEnsResult.reverted) {
    ens = ENS.bind(Address.fromString(OLD_ENS_ADDRESS))
    callEnsResult = ens.try_resolver(appId)
  }

  if (callEnsResult.reverted) {
    log.info('ens resolver reverted', [])
  } else {
    const resolver = PublicResolver.bind(callEnsResult.value)
    const callResolverResult = resolver.try_addr(appId)
    if (callResolverResult.reverted) {
      log.info('resolver addr reverted', [])
    } else {
      return callResolverResult.value
    }
  }

  return Address.fromString(ZERO_ADDR)
}
