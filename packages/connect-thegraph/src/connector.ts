import {
  App,
  ConnectorInterface,
  Permission,
  Repo,
  Role,
} from '@aragon/connect-core'
import { Network } from '@aragon/connect-types'
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

  async appsForOrg(orgAddress: string): Promise<App[]> {
    return this.performQueryWithParser(
      queries.ORGANIZATION_APPS('query'),
      { orgAddress: orgAddress.toLowerCase() },
      parseApps
    )
  }

  onAppsForOrg(
    orgAddress: string,
    callback: Function
  ): { unsubscribe: Function } {
    return this.subscribeToQueryWithParser(
      queries.ORGANIZATION_APPS('query'),
      { orgAddress: orgAddress.toLowerCase() },
      callback,
      parseApps
    )
  }

  async appByAddress(appAddress: string): Promise<App> {
    return this.performQueryWithParser(
      queries.APP_BY_ADDRESS('query'),
      { appAddress: appAddress.toLowerCase() },
      parseApp
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
