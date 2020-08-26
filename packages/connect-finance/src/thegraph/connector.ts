import {
  Address,
  SubscriptionCallback,
  SubscriptionHandler,
} from '@aragon/connect-types'
import { GraphQLWrapper, QueryResult } from '@aragon/connect-thegraph'
import { IFinanceConnector } from '../types'
import Transaction from '../models/Transaction'
import TokenBalance from '../models/TokenBalance'
import * as queries from './queries'
import { parseTransactions, parseTokenBalance } from './parsers'

export function subgraphUrlFromChainId(chainId: number) {
  if (chainId === 1) {
    return 'https://api.thegraph.com/subgraphs/name/aragon/aragon-finance-mainnet'
  }
  if (chainId === 4) {
    return 'https://api.thegraph.com/subgraphs/name/aragon/aragon-finance-rinkeby'
  }
  if (chainId === 100) {
    return 'https://api.thegraph.com/subgraphs/name/aragon/aragon-finance-xdai'
  }
  return null
}

type FinanceConnectorTheGraphConfig = {
  pollInterval?: number
  subgraphUrl?: string
  verbose?: boolean
}

export default class FinanceConnectorTheGraph implements IFinanceConnector {
  #gql: GraphQLWrapper

  constructor(config: FinanceConnectorTheGraphConfig) {
    if (!config.subgraphUrl) {
      throw new Error(
        'FinanceConnectorTheGraph requires subgraphUrl to be passed.'
      )
    }
    this.#gql = new GraphQLWrapper(config.subgraphUrl, {
      pollInterval: config.pollInterval,
      verbose: config.verbose,
    })
  }

  async disconnect() {
    this.#gql.close()
  }

  async transactionsForApp(
    appAddress: Address,
    first: number,
    skip: number
  ): Promise<Transaction[]> {
    return this.#gql.performQueryWithParser<Transaction[]>(
      queries.ALL_TRANSACTIONS('query'),
      { appAddress, first, skip },
      (result: QueryResult) => parseTransactions(result)
    )
  }

  onTransactionsForApp(
    appAddress: Address,
    first: number,
    skip: number,
    callback: SubscriptionCallback<Transaction[]>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<Transaction[]>(
      queries.ALL_TRANSACTIONS('subscription'),
      { appAddress, first, skip },
      callback,
      (result: QueryResult) => parseTransactions(result)
    )
  }

  async balanceForToken(
    appAddress: Address,
    tokenAddress: Address,
    first: number,
    skip: number
  ): Promise<TokenBalance> {
    return this.#gql.performQueryWithParser<TokenBalance>(
      queries.BALANCE_FOR_TOKEN('query'),
      { appAddress, tokenAddress, first, skip },
      (result: QueryResult) => parseTokenBalance(result)
    )
  }

  onBalanceForToken(
    appAddress: Address,
    tokenAddress: Address,
    first: number,
    skip: number,
    callback: SubscriptionCallback<TokenBalance>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<TokenBalance>(
      queries.BALANCE_FOR_TOKEN('subscription'),
      { appAddress, tokenAddress, first, skip },
      callback,
      (result: QueryResult) => parseTransactions(result)
    )
  }
}
