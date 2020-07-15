// TODO: Remove these linting exceptions after implementation.
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { AppFilters, Network, SubscriptionHandler } from '@aragon/connect-types'
import { ConnectionContext } from '../types'
import IOrganizationConnector from './IOrganizationConnector'
import App from '../entities/App'
import Permission from '../entities/Permission'
import Repo from '../entities/Repo'
import Role from '../entities/Role'

export type ConnectorJsonConfig = {
  permissions: Permission[]
  network: Network
}

class ConnectorJson implements IOrganizationConnector {
  #permissions: Permission[]
  readonly name = 'json'
  readonly network: Network
  connection?: ConnectionContext

  constructor({ permissions, network }: ConnectorJsonConfig) {
    this.#permissions = permissions
    this.network = network
  }

  async connect(connection: ConnectionContext) {
    this.connection = connection
  }

  async disconnect() {
    delete this.connection
  }

  async permissionsForOrg(): Promise<Permission[]> {
    return this.#permissions
  }

  onPermissionsForOrg(
    orgAddress: string,
    callback: Function
  ): SubscriptionHandler {
    return {
      unsubscribe: () => {},
    }
  }

  async app(filters: AppFilters): Promise<App> {
    return this.appByAddress('')
  }

  async apps(filters: AppFilters): Promise<App[]> {
    return []
  }

  appForOrg(orgAddress: string): Promise<App> {
    return new Promise(resolve => {
      resolve()
    })
  }

  appsForOrg(orgAddress: string): Promise<App[]> {
    return new Promise(resolve => {
      resolve([])
    })
  }

  onAppForOrg(
    orgAddress: string,
    filters: AppFilters,
    callback: Function
  ): SubscriptionHandler {
    return {
      unsubscribe: () => {},
    }
  }

  onAppsForOrg(
    orgAddress: string,
    filters: AppFilters,
    callback: Function
  ): SubscriptionHandler {
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
}

export default ConnectorJson
