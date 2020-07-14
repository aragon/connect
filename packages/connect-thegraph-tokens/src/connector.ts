import { SubscriptionHandler } from '@aragon/connect-types'
import { GraphQLWrapper } from '@aragon/connect-thegraph'
import * as queries from './queries'
import Token from './entities/Token'
import TokenHolder from './entities/TokenHolder'
import { parseToken, parseTokenHolders } from './parsers'

export default class TokenManagerConnectorTheGraph {
  #gql: GraphQLWrapper

  constructor(subgraphUrl: string, verbose = false) {
    this.#gql = new GraphQLWrapper(subgraphUrl, verbose)
  }

  async token(tokenManagerAddress: string): Promise<Token> {
    return this.#gql.performQueryWithParser<Token>(
      queries.TOKEN('query'),
      { tokenManagerAddress },
      result => parseToken(result, this)
    )
  }

  async tokenHolders(
    tokenAddress: string,
    first: number,
    skip: number
  ): Promise<TokenHolder[]> {
    return this.#gql.performQueryWithParser<TokenHolder[]>(
      queries.TOKEN_HOLDERS('query'),
      { tokenAddress, first, skip },
      result => parseTokenHolders(result, this)
    )
  }

  onTokenHolders(
    tokenAddress: string,
    callback: Function
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.TOKEN_HOLDERS('subscription'),
      { tokenAddress, first: 1000, skip: 0 },
      callback,
      result => parseTokenHolders(result, this)
    )
  }
}
