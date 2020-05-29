import { DataSourceTemplate } from '@graphprotocol/graph-ts'
import { NewAppProxy as NewAppProxyEvent } from '../../generated/templates/Kernel/Kernel'
import * as hooks from '../hooks'

export function handleNewAppProxy(event: NewAppProxyEvent): void {
  if (event.params.appId.toHexString() == hooks.getAppId()) {
    let proxyAddress = event.params.proxy

    DataSourceTemplate.create(hooks.getAppTemplateName(), [proxyAddress.toHex()]);

    let orgAddress = event.address
    hooks.onAppTemplateCreated(orgAddress, proxyAddress)
  }
}
