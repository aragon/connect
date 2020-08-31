import {
  App,
  ConnectionContext,
  IOrganizationConnector,
  Organization,
  Permission,
  Repo,
  Role,
  toNetwork,
} from '@aragon/connect-core'
import {
  Address,
  AppFilters,
  Network,
  Networkish,
  SubscriptionHandler,
  SubscriptionCallback,
} from '@aragon/connect-types'
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
  network: Networkish
  orgSubgraphUrl?: string
  pollInterval?: number
  verbose?: boolean
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
    queryFilter.repoName_in = appFilters.name.map((name: string) =>
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
  connection?: ConnectionContext
  readonly config: ConnectorTheGraphConfig
  readonly name = 'thegraph'
  readonly network: Network

  constructor(config: ConnectorTheGraphConfig) {
    this.config = config
    this.network = toNetwork(config.network)

    const orgSubgraphUrl =
      config.orgSubgraphUrl || getOrgSubgraphUrl(this.network)

    if (!orgSubgraphUrl) {
      throw new Error(
        `The chainId ${this.network.chainId} is not supported by the TheGraph connector.`
      )
    }

    this.#gql = new GraphQLWrapper(orgSubgraphUrl, {
      pollInterval: config.pollInterval,
      verbose: config.verbose,
    })
  }

  async connect(connection: ConnectionContext) {
    this.connection = connection
  }

  async disconnect() {
    this.#gql.close()
    delete this.connection
  }

  async rolesForAddress(
    organization: Organization,
    appAddress: Address
  ): Promise<Role[]> {
    return this.#gql.performQueryWithParser<Role[]>(
      queries.ROLE_BY_APP_ADDRESS('query'),
      { appAddress: appAddress.toLowerCase() },
      (result) => parseRoles(result, organization)
    )
  }

  async permissionsForOrg(organization: Organization): Promise<Permission[]> {
    return this.#gql.performQueryWithParser<Permission[]>(
      queries.ORGANIZATION_PERMISSIONS('query'),
      { orgAddress: organization.address.toLowerCase() },
      (result) => parsePermissions(result, organization)
    )
  }

  onPermissionsForOrg(
    organization: Organization,
    callback: SubscriptionCallback<Permission[]>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<Permission[]>(
      queries.ORGANIZATION_PERMISSIONS('subscription'),
      { orgAddress: organization.address.toLowerCase() },
      callback,
      (result) => parsePermissions(result, organization)
    )
  }

  async appByAddress(
    organization: Organization,
    appAddress: Address
  ): Promise<App> {
    return this.#gql.performQueryWithParser<App>(
      queries.APP_BY_ADDRESS('query'),
      { appAddress: appAddress.toLowerCase() },
      (result) => parseApp(result, organization)
    )
  }

  async appForOrg(
    organization: Organization,
    filters: AppFilters
  ): Promise<App> {
    const apps = await this.#gql.performQueryWithParser<App[]>(
      queries.ORGANIZATION_APPS('query'),
      {
        appFilter: appFiltersToQueryFilter(filters),
        first: 1,
        orgAddress: organization.address.toLowerCase(),
      },
      (result) => parseApps(result, organization)
    )
    return apps[0]
  }

  onAppForOrg(
    organization: Organization,
    filters: AppFilters,
    callback: SubscriptionCallback<App>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<App>(
      queries.ORGANIZATION_APPS('subscription'),
      {
        appFilter: appFiltersToQueryFilter(filters),
        first: 1,
        orgAddress: organization.address.toLowerCase(),
      },
      callback,
      async (result) => {
        const apps = await parseApps(result, organization)
        return apps[0]
      }
    )
  }

  async appsForOrg(
    organization: Organization,
    filters: AppFilters
  ): Promise<App[]> {
    return this.#gql.performQueryWithParser<App[]>(
      queries.ORGANIZATION_APPS('query'),
      {
        appFilter: appFiltersToQueryFilter(filters),
        orgAddress: organization.address.toLowerCase(),
      },
      (result) => parseApps(result, organization)
    )
  }

  onAppsForOrg(
    organization: Organization,
    filters: AppFilters,
    callback: SubscriptionCallback<App[]>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<App[]>(
      queries.ORGANIZATION_APPS('subscription'),
      {
        appFilter: appFiltersToQueryFilter(filters),
        orgAddress: organization.address.toLowerCase(),
      },
      callback,
      (result) => parseApps(result, organization)
    )
  }

  async repoForApp(
    organization: Organization,
    appAddress: Address
  ): Promise<Repo> {
    return this.#gql.performQueryWithParser<Repo>(
      queries.REPO_BY_APP_ADDRESS('query'),
      { appAddress: appAddress.toLowerCase() },
      (result) => parseRepo(result, organization)
    )
  }
}

export default ConnectorTheGraph
