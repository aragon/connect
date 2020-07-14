// TODO: Remove these linting exceptions after implementation.
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { Network } from '@aragon/connect-types'
import { AppFilters } from '@aragon/connect-types'
import {
  IOrganizationConnector,
  Permission,
  App,
  Repo,
  Role,
} from '@aragon/connect-core'

export type ConnectorEthereumConfig = {
  network: Network
}

class ConnectorEthereum implements IOrganizationConnector {
  readonly name = 'ethereum'
  readonly network: Network

  constructor(config: ConnectorEthereumConfig) {
    this.network = config.network
  }

  async permissionsForOrg(): Promise<Permission[]> {
    return new Promise(resolve => {
      resolve([])
    })
  }

  onPermissionsForOrg(
    orgAddress: string,
    callback: Function
  ): { unsubscribe: Function } {
    return {
      unsubscribe: () => {},
    }
  }

  appForOrg(orgAddress: string, filters: AppFilters): Promise<App> {
    return new Promise(resolve => {
      resolve()
    })
  }

  appsForOrg(orgAddress: string, filters: AppFilters): Promise<App[]> {
    return new Promise(resolve => {
      resolve([])
    })
  }

  onAppForOrg(
    orgAddress: string,
    filters: AppFilters,
    callback: Function
  ): { unsubscribe: Function } {
    return {
      unsubscribe: () => {},
    }
  }

  onAppsForOrg(
    orgAddress: string,
    filters: AppFilters,
    callback: Function
  ): { unsubscribe: Function } {
    return {
      unsubscribe: () => {},
    }
  }

  repoForApp(appAddress: string): Promise<Repo> {
    return new Promise(resolve => {
      resolve()
    })
  }

  appByAddress(appAddress: string): Promise<App> {
    return new Promise(resolve => {
      resolve()
    })
  }

  rolesForAddress(appAddress: string): Promise<Role[]> {
    return new Promise(resolve => {
      resolve([])
    })
  }

  async app(filters: AppFilters): Promise<App> {
    return this.appByAddress('')
  }

  async apps(filters: AppFilters): Promise<App[]> {
    return []
  }
}

export default ConnectorEthereum
