import {
  App,
  ConnectorInterface,
  Permission,
  Repo,
  Role,
} from '@aragon/connect-core'
import { AppFilters, Network } from '@aragon/connect-types'
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

export default class ConnectorTheGraph extends GraphQLWrapper
  implements ConnectorInterface {
  constructor(
    network: Network,
    { verbose = false, orgSubgraphUrl }: ConnectorTheGraphConfig = {}
  ) {
    const _orgSubgraphUrl = orgSubgraphUrl || getOrgSubgraphUrl(network)
    if (!_orgSubgraphUrl) {
      throw new Error(
        `The chainId ${network.chainId} is not supported by the TheGraph connector.`
      )
    }
    super(_orgSubgraphUrl, verbose)
  }

  async rolesForAddress(appAddress: string): Promise<Role[]> {
    return this.performQueryWithParser(
      queries.ROLE_BY_APP_ADDRESS('query'),
      { appAddress: appAddress.toLowerCase() },
      parseRoles
    )
  }

  async permissionsForOrg(orgAddress: string): Promise<Permission[]> {
    return this.performQueryWithParser(
      queries.ORGANIZATION_PERMISSIONS('query'),
      { orgAddress: orgAddress.toLowerCase() },
      parsePermissions
    )
  }

  onPermissionsForOrg(
    orgAddress: string,
    callback: Function
  ): { unsubscribe: Function } {
    return this.subscribeToQueryWithParser(
      queries.ORGANIZATION_PERMISSIONS('subscription'),
      { orgAddress: orgAddress.toLowerCase() },
      callback,
      parsePermissions
    )
  }

  async appByAddress(appAddress: string): Promise<App> {
    return this.performQueryWithParser(
      queries.APP_BY_ADDRESS('query'),
      { appAddress: appAddress.toLowerCase() },
      parseApp
    )
  }

  async appForOrg(orgAddress: string, filters: AppFilters): Promise<App> {
    const apps = await this.performQueryWithParser<App[]>(
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
    return this.performQueryWithParser<App[]>(
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
  ): { unsubscribe: Function } {
    return this.subscribeToQueryWithParser(
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
  ): { unsubscribe: Function } {
    return this.subscribeToQueryWithParser(
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
    return this.performQueryWithParser(
      queries.REPO_BY_APP_ADDRESS('query'),
      { appAddress: appAddress.toLowerCase() },
      parseRepo
    )
  }
}
