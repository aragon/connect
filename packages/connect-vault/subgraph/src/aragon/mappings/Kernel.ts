import * as aragon from '../aragon'
import { NewAppProxy as NewAppProxyEvent } from '../../../generated/templates/Kernel/Kernel'

export function handleNewAppProxy(event: NewAppProxyEvent): void {
  aragon.processOrg(event.address)
  aragon.processApp(event.params.proxy, event.params.appId.toHexString(), event.block.timestamp)
}
