import { ethers } from 'ethers'
import {
  Address,
  AppFilters,
  AppFiltersParam,
  Network,
  SubscriptionHandler,
} from '@aragon/connect-types'
import TransactionIntent from '../transactions/TransactionIntent'
import { XDAI_WSS_ENDPOINT } from '../params'
import { ConnectorInterface } from '../connections/ConnectorInterface'
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
  readonly location: string
  #address?: string
  #provider: ethers.providers.Provider
  #connected: boolean

  private _connector: ConnectorInterface

  constructor(
    location: string,
    connector: ConnectorInterface,
    provider: any,
    network: Network
  ) {
    this.location = location

    const getEthersProvider = (): ethers.providers.Provider => {
      try {
        return new ethers.providers.Web3Provider(provider, network)
      } catch (e) {
        return provider
      }
    }

    this.#provider = provider
      ? getEthersProvider()
      : network.chainId === 100
      ? new ethers.providers.WebSocketProvider(XDAI_WSS_ENDPOINT, network)
      : ethers.getDefaultProvider(network)

    this._connector = connector
    this.#connected = false
  }

  async _connect() {
    this.#address = ethers.utils.isAddress(this.location)
      ? this.location
      : await this.#provider.resolveName(this.location)

    if (!ethers.utils.isAddress(this.#address || '')) {
      throw new Error('Please provide a valid address or ENS domain.')
    }

    this.#connected = true
    return true
  }

  private checkConnected() {
    if (!this.#connected) {
      throw new Error(
        'Please call ._connect() before using Organization and its methods.'
      )
    }
  }

  get address(): string {
    this.checkConnected()
    return this.#address || '' // The || '' should never happen but TypeScript requires it.
  }

  get provider(): ethers.providers.Provider {
    this.checkConnected()
    return this.#provider
  }

  ///////// APPS ///////////

  async app(filters?: AppFiltersParam): Promise<App> {
    this.checkConnected()
    return this._connector.appForOrg(this.address, normalizeAppFilters(filters))
  }

  async apps(filters?: AppFiltersParam): Promise<App[]> {
    this.checkConnected()
    return this._connector.appsForOrg(
      this.address,
      normalizeAppFilters(filters)
    )
  }

  onApp(
    filtersOrCallback: AppFiltersParam | OnAppCallback,
    callback?: OnAppCallback
  ): SubscriptionHandler {
    this.checkConnected()

    const filters = (callback ? filtersOrCallback : null) as AppFiltersParam
    const _callback = (callback || filtersOrCallback) as OnAppCallback

    return this._connector.onAppForOrg(
      this.address,
      normalizeAppFilters(filters),
      _callback
    )
  }

  onApps(
    filtersOrCallback: AppFiltersParam | OnAppsCallback,
    callback?: OnAppsCallback
  ): SubscriptionHandler {
    this.checkConnected()

    const filters = (callback ? filtersOrCallback : null) as AppFiltersParam
    const _callback = (callback || filtersOrCallback) as OnAppsCallback

    return this._connector.onAppsForOrg(
      this.address,
      normalizeAppFilters(filters),
      _callback
    )
  }

  ///////// PERMISSIONS ///////////
  async permissions(): Promise<Permission[]> {
    this.checkConnected()
    return this._connector.permissionsForOrg(this.address)
  }

  onPermissions(callback: Function): SubscriptionHandler {
    this.checkConnected()
    return this._connector.onPermissionsForOrg(this.address, callback)
  }

  ///////// INTENTS ///////////
  appIntent(
    appAddress: string,
    funcName: string,
    funcArgs: any[]
  ): TransactionIntent {
    this.checkConnected()
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
