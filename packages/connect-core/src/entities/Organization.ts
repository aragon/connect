import { ethers } from 'ethers'
import { Networkish } from '@aragon/connect-types'

import Application from './Application'
import TransactionIntent from '../transactions/TransactionIntent'
import Permission from './Permission'
import { ConnectorInterface } from '../connections/ConnectorInterface'

// TODO: Implement all properties and methods from the API spec (https://github.com/aragon/connect/blob/master/docs/organization.md).
// [x] Organization#apps()
// [x] Organization#app(appAddress)
// [ ] Organization#addApp(repoName, options)
// [ ] Organization#removeApp(appAddress)
// [x] Organization#permissions()
// [ ] Organization#addPermission(address, appAddress, roleId)
// [ ] Organization#removePermission(address, appAddress, roleId)
// [ ] Organization#roleManager(appAddress, roleId)
// [ ] Organization#setRoleManager(address, appAddress, roleId)
// [ ] Organization#appIntent(appAddress, funcName, funcArgs)
// [ ] Organization#appCall(appAddress, methodName, args)
// [ ] Organization#appState(appAddress)
// [ ] Organization#on(event, params, callback)
// [ ] Organization#off(event, callback)
// [ ] Organization#off(event)
// [ ] Organization#off()
// [ ] Events...

export default class Organization {
  readonly location: string
  #address?: string
  #provider: ethers.providers.Provider

  private _connector: ConnectorInterface

  constructor(
    location: string,
    connector: ConnectorInterface,
    provider: any,
    network: Networkish
  ) {
    this.location = location

    this.#provider = provider
      ? new ethers.providers.Web3Provider(provider, network)
      : new ethers.providers.InfuraProvider(network)

    this._connector = connector
  }

  async _connect() {
    this.#address = ethers.utils.isAddress(this.location)
      ? this.location
      : await this.#provider.resolveName(this.location)
  }

  get address() {
    if (!this.#address) {
      throw new Error(
        'Please call ._connect() before using Organization and its methods.'
      )
    }
    return this.#address
  }

  ///////// APPS ///////////
  async apps(): Promise<Application[]> {
    return this._connector.appsForOrg(this.address)
  }

  onApps(callback: Function): { unsubscribe: Function } {
    return this._connector.onAppsForOrg(this.address, callback)
  }

  async app(appAddress: string): Promise<Application> {
    return this._connector.appByAddress(appAddress)
  }

  // async addApp(
  //   repoName: string,
  //   {
  //     initFuncName,
  //     initFuncArgs,
  //     openPermissions,
  //   }: {
  //     initFuncName: string
  //     initFuncArgs: string[]
  //     openPermissions: boolean
  //   }
  // ): Promise<TransactionIntent> {
  //   return []
  // }

  // async removeApp(appAddress: string): Promise<TransactionIntent> {
  //   return []
  // }

  ///////// PERMISSIONS ///////////
  async permissions(): Promise<Permission[]> {
    return await this._connector.permissionsForOrg(this.address)
  }

  onPermissions(callback: Function): { unsubscribe: Function } {
    return this._connector.onPermissionsForOrg(this.address, callback)
  }

  // async addPermissions(
  //   grantee: string,
  //   roleId: string
  // ): Promise<TransactionIntent> {
  //   return new TransactionIntent(
  //     {
  //       contractAddress: acl,
  //       functionName: '',
  //       functionArgs: [appAddress, grantee, roleId],
  //     },
  //     this,
  //     this.#provider
  //   )
  // }
  // }

  // async removePermissions(
  //   grantee: string,
  //   appAddress: string,
  //   roleId: string
  // ): Promise<TransactionIntent> {
  //   return []
  // }

  // async roleManager(roleId: string): Promise<string> {
  //   const permissions: Permission[] = await this.permissions()

  //   const permission = permissions.filter(
  //     (permission: Permission) => permission.role === roleId
  //   )[0]

  //   const role: Role = await permission.getRole()

  //   return role.manager
  // }

  // async setRoleManager(
  //   grantee: string,
  //   roleId: string
  // ): Promise<TransactionIntent> {
  //   return new TransactionIntent(
  //     {
  //       contractAddress: appAddress,
  //       functionName: funcName,
  //       functionArgs: funcArgs,
  //       finalForwarder: 'aclAddress',
  //     },
  //     this
  //   )
  // }

  ///////// INTENTS ///////////
  appIntent(
    appAddress: string,
    funcName: string,
    funcArgs: any[]
  ): TransactionIntent {
    return new TransactionIntent(
      {
        contractAddress: appAddress,
        functionName: funcName,
        functionArgs: funcArgs,
      },
      this,
      this.#provider
    )
  }
}
