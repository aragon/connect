// TODO: Remove these linting exceptions after implementation.
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { ConnectorInterface } from './ConnectorInterface'
import Permission from '../entities/Permission'
import { App, Repo, Role } from '..'

export type ConnectorJsonConfig = { permissions: Permission[] }

class ConnectorJson implements ConnectorInterface {
  #permissions: Permission[]

  constructor({ permissions }: ConnectorJsonConfig) {
    this.#permissions = permissions
  }

  async permissionsForOrg(): Promise<Permission[]> {
    return this.#permissions
  }

  onPermissionsForOrg(orgAddress: string, callback: Function): { unsubscribe: Function } {
    return {
      unsubscribe: () => {}
    }
  }

  appsForOrg(orgAddress: string): Promise<App[]> {
    return new Promise((resolve) => {
      resolve([])
    })
  }

  onAppsForOrg(orgAddress: string, callback: Function): { unsubscribe: Function } {
    return {
      unsubscribe: () => {}
    }
  }

  repoForApp(appAddress: string): Promise<Repo> {
    return new Promise((resolve) => {
      resolve()
    })
  }

  appByAddress(appAddress: string): Promise<App> {
    return new Promise((resolve) => {
      resolve()
    })
  }

  rolesForAddress(appAddress: string): Promise<Role[]> {
    return new Promise((resolve) => {
      resolve([])
    })
  }
}

export default ConnectorJson
