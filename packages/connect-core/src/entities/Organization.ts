import type {
  Address,
  AppFilters,
  AppFiltersParam,
  SubscriptionCallback,
  SubscriptionResult,
} from '@1hive/connect-types'
import { isAddress } from '@ethersproject/address'

import ForwardingPathDescription, {
  decodeForwardingPath,
  describePath,
  describeTransaction,
} from '../utils/descriptor/index'
import { ConnectionContext, PostProcessDescription } from '../types'
import { ErrorInvalidLocation } from '../errors'
import { normalizeFiltersAndCallback, toArrayEntry } from '../utils/misc'
import { subscription } from '../utils/subscriptions'
import App from './App'
import Permission from './Permission'
import Transaction from './Transaction'
import Role from './Role'

// TODO
// Organization#addApp(repoName, options)
// Organization#removeApp(appAddress)
// Organization#addPermission(address, appAddress, roleId)
// Organization#removePermission(address, appAddress, roleId)
// Organization#roleManager(appAddress, roleId)
// Organization#setRoleManager(address, appAddress, roleId)

type OnAppCallback = SubscriptionCallback<App | null>
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

  //////// ACCOUNT /////////

  actAss(sender: Address): void {
    this.connection.actAs = sender
  }

  ///////// APPS ///////////

  async app(filters?: AppFiltersParam): Promise<App> {
    return this.connection.orgConnector.appForOrg(
      this,
      normalizeAppFilters(filters)
    )
  }

  onApp(
    filtersOrCallback?: AppFiltersParam | OnAppCallback,
    callback?: OnAppCallback
  ): SubscriptionResult<App> {
    const [filters, _callback] = normalizeFiltersAndCallback<
      OnAppCallback,
      AppFiltersParam
    >(filtersOrCallback, callback)

    return subscription<App>(_callback, (callback) =>
      this.connection.orgConnector.onAppForOrg(
        this,
        normalizeAppFilters(filters),
        callback
      )
    )
  }

  async apps(filters?: AppFiltersParam): Promise<App[]> {
    return this.connection.orgConnector.appsForOrg(
      this,
      normalizeAppFilters(filters)
    )
  }

  onApps(
    filtersOrCallback?: AppFiltersParam | OnAppsCallback,
    callback?: OnAppsCallback
  ): SubscriptionResult<App[]> {
    const [filters, _callback] = normalizeFiltersAndCallback<
      OnAppsCallback,
      AppFiltersParam
    >(filtersOrCallback, callback)

    return subscription<App[]>(_callback, (callback) =>
      this.connection.orgConnector.onAppsForOrg(
        this,
        normalizeAppFilters(filters),
        callback
      )
    )
  }

  async acl(): Promise<App> {
    return this.app('acl')
  }

  async kernel(): Promise<App> {
    return this.app('kernel')
  }

  ///////// PERMISSIONS ///////////

  async permissions(): Promise<Permission[]> {
    return this.connection.orgConnector.permissionsForOrg(this)
  }

  onPermissions(
    callback?: SubscriptionCallback<Permission[]>
  ): SubscriptionResult<Permission[]> {
    return subscription<Permission[]>(callback, (callback) =>
      this.connection.orgConnector.onPermissionsForOrg(this, callback)
    )
  }

  ///////// ROLES ///////////

  async roles(appAddress: Address): Promise<Role[]> {
    return this.connection.orgConnector.rolesForAddress(this, appAddress)
  }


  //////// DESCRIPTIONS /////////

  // Return a description of the forwarding path encoded on the evm script
  async describeScript(script: string): Promise<ForwardingPathDescription> {
    const installedApps = await this.apps()

    const describedSteps = await describePath(
      decodeForwardingPath(script),
      installedApps,
      this.connection.ethersProvider
    )

    return new ForwardingPathDescription(describedSteps, installedApps)
  }

  // Try to describe a single transaction using Radspec on the context of the organization
  async describeTransaction(
    transaction: Transaction
  ): Promise<PostProcessDescription> {
    return describeTransaction(
      transaction,
      await this.apps(),
      this.connection.ethersProvider
    )
  }
}
