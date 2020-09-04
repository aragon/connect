import {
  App,
  ConnectionContext,
  ErrorNotFound,
  ErrorUnsupported,
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
      throw new ErrorUnsupported(
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
    try {
      return this.#gql.performQueryWithParser<Role[]>(
        queries.ROLE_BY_APP_ADDRESS('query'),
        { appAddress: appAddress.toLowerCase() },
        async (result) => parseRoles(result, organization)
      )
    } catch (err) {
      throw new ErrorUnexpectedResult(
        'Unexpected result when fetching the roles.'
      )
    }
  }

  async permissionsForOrg(organization: Organization): Promise<Permission[]> {
    try {
      return this.#gql.performQueryWithParser<Permission[]>(
        queries.ORGANIZATION_PERMISSIONS('query'),
        { orgAddress: organization.address.toLowerCase() },
        (result) => parsePermissions(result, organization)
      )
    } catch (err) {
      throw new ErrorUnexpectedResult(
        'Unexpected result when fetching the permissions.'
      )
    }
  }

  onPermissionsForOrg(
    organization: Organization,
    callback: SubscriptionCallback<Permission[]>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<Permission[]>(
      queries.ORGANIZATION_PERMISSIONS('subscription'),
      { orgAddress: organization.address.toLowerCase() },
      callback,
      async (result) => {
        try {
          return await parsePermissions(result, organization)
        } catch (err) {
          throw new ErrorUnexpectedResult(
            'Unexpected result when fetching the permissions.'
          )
        }
      }
    )
  }

  async appByAddress(
    organization: Organization,
    appAddress: Address
  ): Promise<App> {
    try {
      return this.#gql.performQueryWithParser<App>(
        queries.APP_BY_ADDRESS('query'),
        { appAddress: appAddress.toLowerCase() },
        (result) => parseApp(result, organization)
      )
    } catch (err) {
      if (err instanceof ErrorNotFound) {
        throw new ErrorNotFound('No app found with the current filters.')
      }
      throw new ErrorUnexpectedResult(
        'Unexpected result when fetching the app.'
      )
    }
  }

  async appForOrg(
    organization: Organization,
    filters: AppFilters
  ): Promise<App> {
    try {
      const apps = await this.#gql.performQueryWithParser<App[]>(
        queries.ORGANIZATION_APPS('query'),
        {
          appFilter: appFiltersToQueryFilter(filters),
          first: 1,
          orgAddress: organization.address.toLowerCase(),
        },
        async (result) => parseApps(result, organization)
      )
      return apps[0]
    } catch (err) {
      if (err instanceof ErrorNotFound) {
        throw new ErrorNotFound('No app found with the current filters.')
      }
      throw new ErrorUnexpectedResult(
        'Unexpected result when fetching the app.'
      )
    }
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
        try {
          const apps = await parseApps(result, organization)
          if (!apps[0]) {
            throw new ErrorNotFound()
          }
          return apps[0]
        } catch (err) {
          if (err instanceof ErrorNotFound) {
            throw new ErrorNotFound('No app found with the current filters.')
          }
          throw ErrorUnexpectedResult(
            'Unexpected result when fetching the app.'
          )
        }
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
      async (result) => {
        try {
          return await parseApps(result, organization)
        } catch (err) {
          throw new ErrorUnexpectedResult(
            'Unexpected result when fetching the apps.'
          )
        }
      }
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
      async (result) => {
        try {
          return await parseApps(result, organization)
        } catch (err) {
          throw new ErrorUnexpectedResult(
            'Unexpected result when fetching the apps.'
          )
        }
      }
    )
  }

  async repoForApp(
    organization: Organization,
    appAddress: Address
  ): Promise<Repo> {
    return this.#gql.performQueryWithParser<Repo>(
      queries.REPO_BY_APP_ADDRESS('query'),
      { appAddress: appAddress.toLowerCase() },
      async (result) => {
        try {
          return await parseRepo(result, organization)
        } catch (err) {
          if (err instanceof ErrorNotFound) {
            throw new ErrorNotFound('The app repo wasn’t found.')
          }
          throw new ErrorUnexpectedResult(
            'Unexpected result when fetching the app repo.'
          )
        }
      }
    )
  }
}

export default ConnectorTheGraph
