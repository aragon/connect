import { SubscriptionHandler } from '@aragon/connect-types'
import { GraphQLWrapper, QueryResult } from '@aragon/connect-thegraph'
import { IFinanceConnector } from '../types'
import Transaction from '../entities/Transaction'
import TokenBalance from '../entities/TokenBalance'
import * as queries from './queries'
import { parseTransactions, parseTokenBalance } from './parsers'

export function subgraphUrlFromChainId(chainId: number) {
  if (chainId === 1) {
    return 'https://api.thegraph.com/subgraphs/name/0xgabi/aragon-finance-mainnet'
  }
  if (chainId === 4) {
    return 'https://api.thegraph.com/subgraphs/name/0xgabi/aragon-finance-rinkeby'
  }
  if (chainId === 100) {
    return 'https://api.thegraph.com/subgraphs/name/0xgabi/aragon-finance-xdai'
  }
  return null
}

export default class FinanceConnectorTheGraph implements IFinanceConnector {
  #gql: GraphQLWrapper

  constructor(subgraphUrl: string, verbose = false) {
    if (!subgraphUrl) {
      throw new Error(
        'FinanceConnectorTheGraph requires subgraphUrl to be passed.'
      )
    }
    this.#gql = new GraphQLWrapper(subgraphUrl, verbose)
  }

  async disconnect() {
    this.#gql.close()
  }

  async transactionsForApp(
    appAddress: string,
    first: number,
    skip: number
  ): Promise<Transaction[]> {
    return this.#gql.performQueryWithParser(
      queries.ALL_TRANSACTIONS('query'),
      { appAddress, first, skip },
      (result: QueryResult) => parseTransactions(result)
    )
  }

  onTransactionsForApp(
    appAddress: string,
    callback: Function
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.ALL_TRANSACTIONS('subscription'),
      { appAddress, first: 1000, skip: 0 },
      callback,
      (result: QueryResult) => parseTransactions(result)
    )
  }

  async balanceForToken(
    appAddress: string,
    tokenAddress: string,
    first: number,
    skip: number
  ): Promise<TokenBalance> {
    return this.#gql.performQueryWithParser(
      queries.BALANCE_FOR_TOKEN('query'),
      { appAddress, tokenAddress, first, skip },
      (result: QueryResult) => parseTokenBalance(result)
    )
  }
}
