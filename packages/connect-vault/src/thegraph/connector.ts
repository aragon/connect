import { GraphQLWrapper, QueryResult } from '@aragon/connect-thegraph'
import { Address, SubscriptionCallback, SubscriptionHandler } from '@aragon/connect-types'

import * as queries from './queries'
import { IVaultConnector } from '../types'
import { parseTokenBalances } from './parsers'

import TokenBalance from '../models/TokenBalance'

type VaultConnectorTheGraphConfig = {
  pollInterval?: number
  subgraphUrl?: string
  verbose?: boolean
}

export function subgraphUrlFromChainId(chainId: number) {
  if (chainId === 1) {
    return 'https://api.thegraph.com/subgraphs/name/aragon/aragon-vault-mainnet'
  }
  if (chainId === 4) {
    return 'https://api.thegraph.com/subgraphs/name/aragon/aragon-vault-rinkeby'
  }
  if (chainId === 100) {
    return 'https://api.thegraph.com/subgraphs/name/aragon/aragon-vault-xdai'
  }
  return null
}

export default class VaultConnectorTheGraph implements IVaultConnector {
  #gql: GraphQLWrapper

  constructor(config: VaultConnectorTheGraphConfig) {
    if (!config.subgraphUrl) {
      throw new Error('VaultConnectorTheGraph requires subgraphUrl to be passed.')
    }
    this.#gql = new GraphQLWrapper(config.subgraphUrl, {
      pollInterval: config.pollInterval,
      verbose: config.verbose,
    })
  }

  async disconnect() {
    this.#gql.close()
  }

  async tokenBalances(appAddress: Address, first: number, skip: number): Promise<TokenBalance[]> {
    return this.#gql.performQueryWithParser<TokenBalance[]>(
      queries.ALL_BALANCES('query'),
      { appAddress, first, skip },
      (result: QueryResult) => parseTokenBalances(result)
    )
  }

  onTokenBalances(appAddress: Address, first: number, skip: number, callback: SubscriptionCallback<TokenBalance[]>): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<TokenBalance[]>(
      queries.ALL_BALANCES('subscription'),
      { appAddress, first, skip },
      callback,
      (result: QueryResult) => parseTokenBalances(result)
    )
  }
}
