// TODO: Remove these linting exceptions after implementation.
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import {
  Address,
  AppFilters,
  Network,
  SubscriptionCallback,
  SubscriptionHandler,
} from '@aragon/connect-types'
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
  connection?: ConnectionContext
  readonly config: ConnectorEthereumConfig
  readonly name = 'ethereum'
  readonly network: Network

  constructor(config: ConnectorEthereumConfig) {
    this.config = config
    this.network = config.network
  }

  async connect(connection: ConnectionContext) {
    this.connection = connection
  }

  async disconnect() {
    delete this.connection
  }

  async permissionsForOrg(): Promise<Permission[]> {
    return new Promise((resolve) => {
      resolve([])
    })
  }

  onPermissionsForOrg(
    organization: Organization,
    callback: SubscriptionCallback<Permission[]>
  ): SubscriptionHandler {
    return {
      unsubscribe: () => {},
    }
  }

  appForOrg(organization: Organization, filters: AppFilters): Promise<App> {
    return new Promise((resolve) => {
      resolve()
    })
  }

  appsForOrg(organization: Organization, filters: AppFilters): Promise<App[]> {
    return new Promise((resolve) => {
      resolve([])
    })
  }

  onAppForOrg(
    organization: Organization,
    filters: AppFilters,
    callback: SubscriptionCallback<App>
  ): SubscriptionHandler {
    return {
      unsubscribe: () => {},
    }
  }

  onAppsForOrg(
    organization: Organization,
    filters: AppFilters,
    callback: SubscriptionCallback<App[]>
  ): SubscriptionHandler {
    return {
      unsubscribe: () => {},
    }
  }

  repoForApp(organization: Organization, appAddress: Address): Promise<Repo> {
    return new Promise((resolve) => {
      resolve()
    })
  }

  appByAddress(organization: Organization, appAddress: Address): Promise<App> {
    return new Promise((resolve) => {
      resolve()
    })
  }

  rolesForAddress(
    organization: Organization,
    appAddress: Address
  ): Promise<Role[]> {
    return new Promise((resolve) => {
      resolve([])
    })
  }
}

export default ConnectorEthereum
