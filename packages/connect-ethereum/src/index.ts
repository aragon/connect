// TODO: Remove these linting exceptions after implementation.
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { ConnectorInterface, Permission, Application, Repository, Role } from '@aragon/connect-core'

export type ConnectorEthereumConfig = object

class ConnectorEthereum implements ConnectorInterface {
  constructor(config: ConnectorEthereumConfig = {}) {}

  async permissionsForOrg(): Promise<Permission[]> {
    return new Promise((resolve) => {
      resolve([])
    })
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

export default ConnectorEthereum
