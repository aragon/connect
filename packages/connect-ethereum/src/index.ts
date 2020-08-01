// TODO: Remove these linting exceptions after implementation.
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { AppFilters, Network, SubscriptionHandler } from '@aragon/connect-types'
import {
  App,
  ConnectionContext,
  IOrganizationConnector,
  Organization,
  Permission,
  Repo,
  Role,
} from '@aragon/connect-core'

export type ConnectorEthereumConfig = {
  network: Network
}

class ConnectorEthereum implements IOrganizationConnector {
  readonly name = 'ethereum'
  readonly network: Network
  connection?: ConnectionContext

  constructor(config: ConnectorEthereumConfig) {
    this.network = config.network
  }

  async connect(connection: ConnectionContext) {
    this.connection = connection
  }

  async disconnect() {
    delete this.connection
  }

  async permissionsForOrg(): Promise<Permission[]> {
    return new Promise(resolve => {
      resolve([])
    })
  }

  onPermissionsForOrg(
    organization: Organization,
    callback: Function
  ): SubscriptionHandler {
    return {
      unsubscribe: () => {},
    }
  }

  appForOrg(organization: Organization, filters: AppFilters): Promise<App> {
    return new Promise(resolve => {
      resolve()
    })
  }

  appsForOrg(organization: Organization, filters: AppFilters): Promise<App[]> {
    return new Promise(resolve => {
      resolve([])
    })
  }

  onAppForOrg(
    organization: Organization,
    filters: AppFilters,
    callback: Function
  ): SubscriptionHandler {
    return {
      unsubscribe: () => {},
    }
  }

  onAppsForOrg(
    organization: Organization,
    filters: AppFilters,
    callback: Function
  ): SubscriptionHandler {
    return {
      unsubscribe: () => {},
    }
  }

  repoForApp(organization: Organization, appAddress: string): Promise<Repo> {
    return new Promise(resolve => {
      resolve()
    })
  }

  appByAddress(organization: Organization, appAddress: string): Promise<App> {
    return new Promise(resolve => {
      resolve()
    })
  }

  rolesForAddress(
    organization: Organization,
    appAddress: string
  ): Promise<Role[]> {
    return new Promise(resolve => {
      resolve([])
    })
  }
}

export default ConnectorEthereum
