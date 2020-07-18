// TODO: Remove these linting exceptions after implementation.
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { AppFilters, Network, SubscriptionHandler } from '@aragon/connect-types'
import { App, Repo, Role } from '..'
import Permission from '../entities/Permission'
import { ConnectorInterface } from './ConnectorInterface'

export type ConnectorJsonConfig = { permissions: Permission[] }

class ConnectorJson implements ConnectorInterface {
  #permissions: Permission[]

  constructor({ permissions }: ConnectorJsonConfig) {
    this.#permissions = permissions
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
