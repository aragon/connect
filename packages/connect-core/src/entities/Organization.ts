import {
  Address,
  AppFilters,
  AppFiltersParam,
  SubscriptionHandler,
  SubscriptionCallback,
} from '@aragon/connect-types'
import { ConnectionContext } from '../types'
import { ErrorInvalidLocation } from '../errors'
import TransactionIntent from '../transactions/TransactionIntent'
import { toArrayEntry } from '../utils/misc'
import { isAddress } from '../utils/address'
import App from './App'
import Permission from './Permission'

// TODO
// Organization#addApp(repoName, options)
// Organization#removeApp(appAddress)
// Organization#addPermission(address, appAddress, roleId)
// Organization#removePermission(address, appAddress, roleId)
// Organization#roleManager(appAddress, roleId)
// Organization#setRoleManager(address, appAddress, roleId)

type OnAppCallback = SubscriptionCallback<App>
type OnAppsCallback = SubscriptionCallback<App[]>

function normalizeAppFilters(filters?: AppFiltersParam): AppFilters {
  if (!filters) {
    return {}
  }

  if (typeof filters === 'string') {
    return isAddress(filters) ? { address: [filters] } : { name: [filters] }
  }

  if (Array.isArray(filters)) {
    return isAddress(filters[0] ?? '')
      ? { address: filters }
      : { name: filters }
  }

  if (filters.address) {
    const addresses = toArrayEntry(filters.address)
    if (!addresses.every(isAddress)) {
      throw new ErrorInvalidLocation()
    }
    return { address: addresses }
  }

  if (filters.name) {
    return { name: toArrayEntry(filters.name) }
  }

  return {}
}

export default class Organization {
  readonly connection: ConnectionContext

  constructor(connection: ConnectionContext) {
    this.connection = connection
  }

  get location() {
    return this.connection.orgLocation
  }

  get address(): Address {
    return this.connection.orgAddress
  }

  get _connection(): ConnectionContext {
    return this.connection
  }

  ///////// APPS ///////////

  async app(filters?: AppFiltersParam): Promise<App> {
    return this.connection.orgConnector.appForOrg(
      this,
      normalizeAppFilters(filters)
    )
  }

  onApp(
    filtersOrCallback: AppFiltersParam | OnAppCallback,
    callback?: OnAppCallback
  ): SubscriptionHandler {
    const filters = (callback ? filtersOrCallback : null) as AppFiltersParam
    const _callback = (callback || filtersOrCallback) as OnAppCallback

    return this.connection.orgConnector.onAppForOrg(
      this,
      normalizeAppFilters(filters),
      _callback
    )
  }

  async apps(filters?: AppFiltersParam): Promise<App[]> {
    return this.connection.orgConnector.appsForOrg(
      this,
      normalizeAppFilters(filters)
    )
  }

  onApps(
    filtersOrCallback: AppFiltersParam | OnAppsCallback,
    callback?: OnAppsCallback
  ): SubscriptionHandler {
    const filters = (callback ? filtersOrCallback : null) as AppFiltersParam
    const _callback = (callback || filtersOrCallback) as OnAppsCallback

    return this.connection.orgConnector.onAppsForOrg(
      this,
      normalizeAppFilters(filters),
      _callback
    )
  }

  ///////// PERMISSIONS ///////////
  async permissions(): Promise<Permission[]> {
    return this.connection.orgConnector.permissionsForOrg(this)
  }

  onPermissions(
    callback: SubscriptionCallback<Permission[]>
  ): SubscriptionHandler {
    return this.connection.orgConnector.onPermissionsForOrg(this, callback)
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
      this.connection.ethersProvider
    )
  }
}
