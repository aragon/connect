import { ethers } from 'ethers'

import App from './App'
import TransactionIntent from '../transactions/TransactionIntent'
import Permission from './Permission'
import Role from './Role'
import { ConnectorInterface } from '../connections/ConnectorInterface'

// TODO: Implement all properties and methods from the API spec (https://github.com/aragon/plumbery/blob/master/docs/organization.md).
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
  #address: string
  #connector: ConnectorInterface
  #provider: ethers.providers.Provider

  constructor(
    address: string,
    connector: ConnectorInterface,
    provider?: ethers.providers.Provider,
    chainId?: number
  ) {
    this.#address = address
    this.#connector = connector
    this.#provider =
      provider ||
      new ethers.providers.InfuraProvider(chainId || connector.chainId || 1)
  }

  ///////// APPS ///////////
  async apps(): Promise<App[]> {
    return this.#connector.appsForOrg!(this.#address)
  }

  async app(appAddress: string): Promise<App> {
    return this.#connector.appByAddress!(appAddress)
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
    const allPermissions = await this.#connector.permissionsForOrg(
      this.#address
    )
    return allPermissions.filter((permission) => permission.allowed === true)
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
