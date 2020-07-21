import { Address, SubscriptionHandler } from '@aragon/connect-types'
import { GraphQLWrapper } from '@aragon/connect-thegraph'
import { ITokensConnector } from '../types'
import * as queries from './queries'
import Token from '../entities/Token'
import TokenHolder from '../entities/TokenHolder'
import { parseToken, parseTokenHolders } from './parsers'

export function subgraphUrlFromChainId(chainId: number) {
  if (chainId === 1) {
    return 'https://api.thegraph.com/subgraphs/name/aragon/aragon-tokens-mainnet'
  }
  if (chainId === 4) {
    return 'https://api.thegraph.com/subgraphs/name/aragon/aragon-tokens-rinkeby'
  }
  return null
}

export default class TokensConnectorTheGraph implements ITokensConnector {
  #gql: GraphQLWrapper
  #token: Token

  constructor(gql: GraphQLWrapper, token: Token) {
    this.#gql = gql
    this.#token = token
  }

  static async create(
    subgraphUrl: string,
    appAddress: Address,
    verbose: boolean = false
  ): Promise<TokensConnectorTheGraph> {
    if (!subgraphUrl) {
      throw new Error(
        'TokensConnectorTheGraph requires subgraphUrl to be passed.'
      )
    }

    const gql = new GraphQLWrapper(subgraphUrl, verbose)

    const token = await gql.performQueryWithParser<Token>(
      queries.TOKEN('query'),
      { tokenManagerAddress: appAddress },
      result => parseToken(result)
    )

    return new TokensConnectorTheGraph(gql, token)
  }

  async token(): Promise<Token> {
    return this.#token
  }

  async tokenHolders(
    tokenAddress: string,
    first: number,
    skip: number
  ): Promise<TokenHolder[]> {
    return this.#gql.performQueryWithParser<TokenHolder[]>(
      queries.TOKEN_HOLDERS('query'),
      { tokenAddress, first, skip },
      result => parseTokenHolders(result)
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
      result => parseTokenHolders(result)
    )
  }
}
