import { SubscriptionHandler } from '@aragon/connect-types'
import { GraphQLWrapper, QueryResult } from '@aragon/connect-thegraph'

import * as queries from './queries'
import Version from '../entities/Version'
import { AgreementData, IAgreementConnector } from '../types'
import { parseAgreement, parseCurrentVersion, parseVersions, parseVersion } from './parsers'

export function subgraphUrlFromChainId(chainId: number) {
  if (chainId === 1) {
    return 'https://api.thegraph.com/subgraphs/name/aragon/aragon-agreement-mainnet'
  }
  if (chainId === 4) {
    return 'https://api.thegraph.com/subgraphs/name/aragon/aragon-agreement-rinkeby'
  }
  if (chainId === 100) {
    return 'https://api.thegraph.com/subgraphs/name/aragon/aragon-agreement-xdai'
  }
  return null
}

export default class AgreementConnectorTheGraph implements IAgreementConnector {
  #gql: GraphQLWrapper

  constructor(subgraphUrl: string, verbose: boolean = false) {
    if (!subgraphUrl) {
      throw new Error(
        'AgreementConnectorTheGraph requires subgraphUrl to be passed.'
      )
    }
    this.#gql = new GraphQLWrapper(subgraphUrl, verbose)
  }

  async disconnect() {
    this.#gql.close()
  }

  async agreement(agreement: string): Promise<AgreementData> {
    return this.#gql.performQueryWithParser(
      queries.GET_AGREEMENT('query'),
      { agreement },
      (result: QueryResult) => parseAgreement(result)
    )
  }

  async currentVersion(agreement: string): Promise<Version> {
    return this.#gql.performQueryWithParser(
      queries.GET_CURRENT_VERSION('query'),
      { agreement },
      (result: QueryResult) => parseCurrentVersion(result, this)
    )
  }

  onCurrentVersion(agreement: string, callback: Function): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.GET_CURRENT_VERSION('subscription'),
      { agreement },
      callback,
      (result: QueryResult) => parseCurrentVersion(result, this)
    )
  }

  async version(versionId: string): Promise<Version> {
    return this.#gql.performQueryWithParser(
      queries.GET_VERSION('query'),
      { versionId },
      (result: QueryResult) => parseVersion(result, this)
    )
  }

  onVersion(versionId: string, callback: Function): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.GET_VERSION('subscription'),
      { versionId },
      callback,
      (result: QueryResult) => parseVersion(result, this)
    )
  }

  async versions(agreement: string, first: number, skip: number): Promise<Version[]> {
    return this.#gql.performQueryWithParser(
      queries.ALL_VERSIONS('query'),
      { agreement, first, skip },
      (result: QueryResult) => parseVersions(result, this)
    )
  }

  onVersions(agreement: string, callback: Function): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.ALL_VERSIONS('subscription'),
      { agreement, first: 1000, skip: 0 },
      callback,
      (result: QueryResult) => parseVersions(result, this)
    )
  }
}
