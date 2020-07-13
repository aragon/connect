import { ethereum } from '@graphprotocol/graph-ts'
import { NewAppProxy as NewAppProxyEvent } from '../../../generated/templates/Kernel/Kernel'
import * as aragon from '../aragon'

export function handleNewAppProxy(event: NewAppProxyEvent): void {
  aragon.processOrg(event.address)
  aragon.processApp(event.params.proxy, event.params.appId.toHexString())
}

export function handleBlock(block: ethereum.Block): void {
  aragon.processBlock(block)
}
