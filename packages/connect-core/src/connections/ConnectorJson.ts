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
import { ConnectionContext } from '../types'
import IOrganizationConnector from './IOrganizationConnector'
import App from '../entities/App'
import Organization from '../entities/Organization'
import Permission from '../entities/Permission'
import Repo from '../entities/Repo'
import Role from '../entities/Role'

export type ConnectorJsonConfig = {
  permissions: Permission[]
  network: Network
}

class ConnectorJson implements IOrganizationConnector {
  #permissions: Permission[]
  connection?: ConnectionContext
  readonly config: ConnectorJsonConfig
  readonly name = 'json'
  readonly network: Network

  constructor(config: ConnectorJsonConfig) {
    this.config = config
    this.network = config.network
    this.#permissions = config.permissions
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
    organization: Organization,
    callback: SubscriptionCallback<Permission[]>
  ): SubscriptionHandler {
    return {
      unsubscribe: () => {},
    }
  }

  async app(organization: Organization, filters: AppFilters): Promise<App> {
    return this.appByAddress(organization, '')
  }

  async apps(filters: AppFilters): Promise<App[]> {
    return []
  }

  appForOrg(organization: Organization): Promise<App> {
    return new Promise((resolve) => {
      resolve()
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

  appsForOrg(organization: Organization): Promise<App[]> {
    return new Promise((resolve) => {
      resolve([])
    })
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

export default ConnectorJson
