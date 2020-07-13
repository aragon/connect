import {
  App,
  IOrganizationConnector,
  Permission,
  Repo,
  Role,
} from '@aragon/connect-core'
import { AppFilters, Network, SubscriptionHandler } from '@aragon/connect-types'
import * as queries from './queries'
import GraphQLWrapper from './core/GraphQLWrapper'
import {
  parseApp,
  parseApps,
  parsePermissions,
  parseRepo,
  parseRoles,
} from './parsers'

export type ConnectorTheGraphConfig = {
  verbose?: boolean
  orgSubgraphUrl?: string
}

function getOrgSubgraphUrl(network: Network): string | null {
  if (network.chainId === 1) {
    return 'https://api.thegraph.com/subgraphs/name/aragon/aragon-mainnet'
  }
  if (network.chainId === 4) {
    return 'https://api.thegraph.com/subgraphs/name/aragon/aragon-rinkeby'
  }
  if (network.chainId === 100) {
    return 'https://api.thegraph.com/subgraphs/name/1hive/aragon-xdai'
  }
  return null
}

function appFiltersToQueryFilter(appFilters: AppFilters) {
  const queryFilter = {} as any

  if (appFilters.name) {
    queryFilter.repoName_in = appFilters.name.map(name =>
      name.replace(/\.aragonpm\.eth$/, '')
    )
  }

  if (appFilters.address) {
    queryFilter.address_in = appFilters.address
  }

  return queryFilter
}

class ConnectorTheGraph implements IOrganizationConnector {
  #gql: GraphQLWrapper
  readonly name = 'thegraph'

  constructor(network: Network, config: ConnectorTheGraphConfig = {}) {
    const orgSubgraphUrl = config.orgSubgraphUrl || getOrgSubgraphUrl(network)
    if (!orgSubgraphUrl) {
      throw new Error(
        `The chainId ${network.chainId} is not supported by the TheGraph connector.`
      )
    }
    this.#gql = new GraphQLWrapper(orgSubgraphUrl, config.verbose)
  }

  async rolesForAddress(appAddress: string): Promise<Role[]> {
    return this.#gql.performQueryWithParser(
      queries.ROLE_BY_APP_ADDRESS('query'),
      { appAddress: appAddress.toLowerCase() },
      parseRoles
    )
  }

  async permissionsForOrg(orgAddress: string): Promise<Permission[]> {
    return this.#gql.performQueryWithParser(
      queries.ORGANIZATION_PERMISSIONS('query'),
      { orgAddress: orgAddress.toLowerCase() },
      parsePermissions
    )
  }

  onPermissionsForOrg(
    orgAddress: string,
    callback: Function
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.ORGANIZATION_PERMISSIONS('subscription'),
      { orgAddress: orgAddress.toLowerCase() },
      callback,
      parsePermissions
    )
  }

  async appByAddress(appAddress: string): Promise<App> {
    return this.#gql.performQueryWithParser(
      queries.APP_BY_ADDRESS('query'),
      { appAddress: appAddress.toLowerCase() },
      parseApp
    )
  }

  async appForOrg(orgAddress: string, filters: AppFilters): Promise<App> {
    const apps = await this.#gql.performQueryWithParser<App[]>(
      queries.ORGANIZATION_APPS('query'),
      {
        appFilter: appFiltersToQueryFilter(filters),
        first: 1,
        orgAddress: orgAddress.toLowerCase(),
      },
      parseApps
    )
    return apps[0]
  }

  async appsForOrg(orgAddress: string, filters: AppFilters): Promise<App[]> {
    return this.#gql.performQueryWithParser<App[]>(
      queries.ORGANIZATION_APPS('query'),
      {
        appFilter: appFiltersToQueryFilter(filters),
        orgAddress: orgAddress.toLowerCase(),
      },
      parseApps
    )
  }

  onAppForOrg(
    orgAddress: string,
    filters: AppFilters,
    callback: Function
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.ORGANIZATION_APPS('subscription'),
      {
        appFilter: appFiltersToQueryFilter(filters),
        first: 1,
        orgAddress: orgAddress.toLowerCase(),
      },
      (apps: App[]) => callback(apps[0]),
      parseApps
    )
  }

  onAppsForOrg(
    orgAddress: string,
    filters: AppFilters,
    callback: Function
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.ORGANIZATION_APPS('subscription'),
      {
        appFilter: appFiltersToQueryFilter(filters),
        orgAddress: orgAddress.toLowerCase(),
      },
      callback,
      parseApps
    )
  }

  async repoForApp(appAddress: string): Promise<Repo> {
    return this.#gql.performQueryWithParser(
      queries.REPO_BY_APP_ADDRESS('query'),
      { appAddress: appAddress.toLowerCase() },
      parseRepo
    )
  }
}

export default ConnectorTheGraph
