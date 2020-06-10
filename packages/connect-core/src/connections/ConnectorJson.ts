import { ConnectorInterface } from './ConnectorInterface'
import Permission from '../entities/Permission'
import { Application, Repository, Role } from '..'

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

  appsForOrg(orgAddress: string): Promise<Application[]> {
    return new Promise((resolve) => {
      resolve([])
    })
  }

  onAppsForOrg(orgAddress: string, callback: Function): { unsubscribe: Function } {
    return {
      unsubscribe: () => {}
    }
  }

  repoForApp(appAddress: string): Promise<Repository> {
    return new Promise((resolve) => {
      resolve()
    })
  }

  appByAddress(appAddress: string): Promise<Application> {
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
