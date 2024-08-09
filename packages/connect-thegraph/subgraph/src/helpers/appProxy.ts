import { Address, log } from '@graphprotocol/graph-ts'

import { AppProxyForwarder as AppProxyForwarderContract } from '../../generated/templates/Kernel/AppProxyForwarder'

export function isForwarder(proxy: Address): boolean {
  // Check if app is forwarder
  log.debug('isForwarder: proxy: {}', [proxy.toHexString()])
  const appForwarder = AppProxyForwarderContract.bind(proxy)
  const callForwarderResult = appForwarder.try_isForwarder()
  if (callForwarderResult.reverted) {
    return false
  } else {
    return callForwarderResult.value
  }
}
