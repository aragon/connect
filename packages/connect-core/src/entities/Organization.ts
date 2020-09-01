import {
  Address,
  AppFilters,
  AppFiltersParam,
  SubscriptionHandler,
  SubscriptionCallback,
} from '@aragon/connect-types'
import { utils as ethersUtils } from 'ethers'

import ForwardingPathDescription, {
  decodeForwardingPath,
  describePath,
  describeTransaction,
} from '../utils/descriptor/index'
import { organizationIntent } from '../utils/intent'
import { toArrayEntry } from '../utils/misc'
import {
  ConnectionContext,
  AppOrAddress,
  PathOptions,
  PostProcessDescription,
} from '../types'
import App from './App'
import ForwardingPath from './ForwardingPath'
import Permission from './Permission'
import Transaction from './Transaction'

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

  async apps(filters?: AppFiltersParam): Promise<App[]> {
    return this.connection.orgConnector.appsForOrg(
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
    callback: SubscriptionCallback<Permission[]>
  ): SubscriptionHandler {
    return this.connection.orgConnector.onPermissionsForOrg(this, callback)
  }

  ///////// INTENTS ///////////

  /**
   * Calculate the transaction path for a transaction to an external `destination`
   * (not the currently running app) that invokes a method matching the
   * `methodAbiFragment` with `params`.
   *
   * @param  {string} destination Address of the external contract
   * @param  {object} methodAbiFragment ABI fragment of method to invoke
   * @param  {Array<*>} params
   * @param  {Object} options
   * @return {Promise<ForwardingPath>} An object that represents the forwarding path corresponding to an action.
   *   If the destination is a non-installed contract, always results in a
   *   single step transaction.
   */
  async intent(
    destination: AppOrAddress,
    methodAbiFragment: ethersUtils.FunctionFragment,
    params: any[],
    options: PathOptions
  ): Promise<ForwardingPath | undefined> {
    const sender = options.actAs || this.connection.actAs
    if (!sender) {
      throw new Error(
        `No sender address specified. Use 'actAs' option or set one as default on your organization connection.`
      )
    }

    const installedApps = await this.apps()

    return organizationIntent(
      sender,
      destination,
      methodAbiFragment,
      params,
      installedApps,
      this.connection.ethersProvider
    )
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

    // TODO: Add decorators
    // // Add name and identifier decoration
    // const docoratedStep = describedSteps.map(async (step) => {
    //   const app = installedApps.find((app) => app.address === step.to)

    //   if (app) {
    //     return {
    //       ...step,
    //       identifier: app.appId,
    //       name: app.appName,
    //     }
    //   }

    //   return step
    // })

    return new ForwardingPathDescription(describedSteps)
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
