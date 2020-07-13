import { ethers } from 'ethers'
import {
  Address,
  AppFilters,
  AppFiltersParam,
  SubscriptionHandler,
} from '@aragon/connect-types'
import { ConnectionContext } from '../types'
import TransactionIntent from '../transactions/TransactionIntent'
import { toArrayEntry } from '../utils/misc'
import App from './App'
import Permission from './Permission'

// TODO
// Organization#addApp(repoName, options)
// Organization#removeApp(appAddress)
// Organization#addPermission(address, appAddress, roleId)
// Organization#removePermission(address, appAddress, roleId)
// Organization#roleManager(appAddress, roleId)
// Organization#setRoleManager(address, appAddress, roleId)

type OnAppCallback = (app: App) => void
type OnAppsCallback = (apps: App[]) => void

function normalizeAppFilters(filters?: AppFiltersParam): AppFilters {
  if (!filters) {
    return {}
  }

  if (typeof filters === 'string') {
    return filters.startsWith('0x')
      ? { address: [filters] }
      : { name: [filters] }
  }

  if (Array.isArray(filters)) {
    return filters[0]?.startsWith('0x')
      ? { address: filters }
      : { name: filters }
  }

  if (filters.address) {
    return { address: toArrayEntry(filters.address) }
  }

  if (filters.name) {
    return { name: toArrayEntry(filters.name) }
  }

  return {}
}

export default class Organization {
  #connection: ConnectionContext

  constructor(connection: ConnectionContext) {
    this.#connection = connection
  }

  get location() {
    return this.#connection.orgLocation
  }

  get address(): Address {
    return this.#connection.orgAddress
  }

  get provider(): ethers.providers.Provider {
    return this.#connection.ethersProvider
  }

  ///////// APPS ///////////

  async app(filters?: AppFiltersParam): Promise<App> {
    return this.#connection.orgConnector.appForOrg(
      this.address,
      normalizeAppFilters(filters)
    )
  }

  async apps(filters?: AppFiltersParam): Promise<App[]> {
    return this.#connection.orgConnector.appsForOrg(
      this.address,
      normalizeAppFilters(filters)
    )
  }

  onApp(
    filtersOrCallback: AppFiltersParam | OnAppCallback,
    callback?: OnAppCallback
  ): SubscriptionHandler {
    const filters = (callback ? filtersOrCallback : null) as AppFiltersParam
    const _callback = (callback || filtersOrCallback) as OnAppCallback

    return this.#connection.orgConnector.onAppForOrg(
      this.address,
      normalizeAppFilters(filters),
      _callback
    )
  }

  onApps(
    filtersOrCallback: AppFiltersParam | OnAppsCallback,
    callback?: OnAppsCallback
  ): SubscriptionHandler {
    const filters = (callback ? filtersOrCallback : null) as AppFiltersParam
    const _callback = (callback || filtersOrCallback) as OnAppsCallback

    return this.#connection.orgConnector.onAppsForOrg(
      this.address,
      normalizeAppFilters(filters),
      _callback
    )
  }

  ///////// PERMISSIONS ///////////
  async permissions(): Promise<Permission[]> {
    return this.#connection.orgConnector.permissionsForOrg(this.address)
  }

  onPermissions(callback: Function): SubscriptionHandler {
    return this.#connection.orgConnector.onPermissionsForOrg(
      this.address,
      callback
    )
  }

  ///////// INTENTS ///////////
  appIntent(
    appAddress: Address,
    functionName: string,
    functionArgs: any[]
  ): TransactionIntent {
    return new TransactionIntent(
      { contractAddress: appAddress, functionName, functionArgs },
      this,
      this.#connection.ethersProvider
    )
  }
}
