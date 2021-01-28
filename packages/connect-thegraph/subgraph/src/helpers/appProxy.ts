import { Address } from '@graphprotocol/graph-ts'

import { AppProxyForwarder as AppProxyForwarderContract } from '../../generated/templates/Kernel/AppProxyForwarder'

export function isForwarder(proxy: Address): boolean {
  // Check if app is forwarder
  const appForwarder = AppProxyForwarderContract.bind(proxy)
  const callForwarderResult = appForwarder.try_isForwarder()
  if (callForwarderResult.reverted) {
    return false
  } else {
    return callForwarderResult.value
  }
}
