import { ConnectorInterface, Permission } from '@aragon/connect-core'

export type ConnectorEthereumConfig = object

class ConnectorEthereum implements ConnectorInterface {
  constructor({}: ConnectorEthereumConfig) {}

  async permissionsForOrg(): Promise<Permission[]> {
    return []
  }
}

export default ConnectorEthereum
