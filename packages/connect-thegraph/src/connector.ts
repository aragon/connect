import {
  ConnectorInterface,
  Permission,
  App,
  Repo,
  Role,
} from '@aragon/connect-core'
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
  daoSubgraphUrl?: string
  verbose?: boolean
}

const DAO_SUBGRAPH_URL_DEFAULT =
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-mainnet'

// https://api.thegraph.com/subgraphs/name/ensdomains/ens
// https://api.thegraph.com/subgraphs/name/ensdomains/ensrinkeby

export default class ConnectorTheGraph extends GraphQLWrapper
  implements ConnectorInterface {
  constructor({
    daoSubgraphUrl = DAO_SUBGRAPH_URL_DEFAULT,
    verbose = false,
  }: ConnectorTheGraphConfig = {}) {
    super(daoSubgraphUrl, verbose)
  }

  async rolesForAddress(appAddress: string): Promise<Role[]> {
    const query = queries.ROLE_BY_APP_ADDRESS
    const args = {
      appAddress: appAddress.toLowerCase()
    }

    return this.performQueryWithParser(query, args, parseRoles)
  }

  async permissionsForOrg(orgAddress: string): Promise<Permission[]> {
    return this.performQueryWithParser(
      queries.ORGANIZATION_PERMISSIONS('query'),
      { orgAddress: orgAddress.toLowerCase() },
      parsePermissions
    )
  }

  onPermissionsForOrg(orgAddress: string, callback: Function): { unsubscribe: Function } {
    return this.subscribeToQueryWithParser(
      queries.ORGANIZATION_PERMISSIONS('subscription'),
      { orgAddress: orgAddress.toLowerCase() },
      callback,
      parsePermissions
    )
  }

  async appsForOrg(orgAddress: string): Promise<App[]> {
    const query = queries.ORGANIZATION_APPS
    const args = {
      orgAddress: orgAddress.toLowerCase()
    }

    return this.performQueryWithParser(query, args, parseApps)
  }

  async appByAddress(appAddress: string): Promise<App> {
    const query = queries.APP_BY_ADDRESS
    const args = {
      appAddress: appAddress.toLowerCase()
    }

    return this.performQueryWithParser(query, args, parseApp)
  }

  async repoForApp(appAddress: string): Promise<Repo> {
    const query = queries.REPO_BY_APP_ADDRESS
    const args = {
      appAddress: appAddress.toLowerCase()
    }

    return this.performQueryWithParser(query, args, parseRepo)
  }
}
