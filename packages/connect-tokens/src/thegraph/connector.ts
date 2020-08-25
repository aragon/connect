import {
  Address,
  SubscriptionCallback,
  SubscriptionHandler,
} from '@aragon/connect-types'
import { GraphQLWrapper } from '@aragon/connect-thegraph'
import { ITokensConnector } from '../types'
import * as queries from './queries'
import Token from '../models/Token'
import TokenHolder from '../models/TokenHolder'
import { parseToken, parseTokenHolders } from './parsers'

export function subgraphUrlFromChainId(chainId: number) {
  if (chainId === 1) {
    return 'https://api.thegraph.com/subgraphs/name/aragon/aragon-tokens-mainnet'
  }
  if (chainId === 4) {
    return 'https://api.thegraph.com/subgraphs/name/aragon/aragon-tokens-rinkeby'
  }
  if (chainId === 100) {
    return 'https://api.thegraph.com/subgraphs/name/aragon/aragon-tokens-xdai'
  }
  return null
}

type TokensConnectorTheGraphConfig = {
  appAddress?: Address
  pollInterval?: number
  subgraphUrl?: string
  verbose?: boolean
}

export default class TokensConnectorTheGraph implements ITokensConnector {
  #gql: GraphQLWrapper
  #token: Token

  constructor(gql: GraphQLWrapper, token: Token) {
    this.#gql = gql
    this.#token = token
  }

  static async create(
    config: TokensConnectorTheGraphConfig
  ): Promise<TokensConnectorTheGraph> {
    if (!config.subgraphUrl) {
      throw new Error(
        'TokensConnectorTheGraph requires subgraphUrl to be passed.'
      )
    }

    if (!config.appAddress) {
      throw new Error(
        'TokensConnectorTheGraph requires appAddress to be passed.'
      )
    }

    const gql = new GraphQLWrapper(config.subgraphUrl, {
      pollInterval: config.pollInterval,
      verbose: config.verbose,
    })

    const token = await gql.performQueryWithParser<Token>(
      queries.TOKEN('query'),
      { tokenManagerAddress: config.appAddress },
      (result) => parseToken(result)
    )

    return new TokensConnectorTheGraph(gql, token)
  }

  async disconnect() {
    this.#gql.close()
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
      (result) => parseTokenHolders(result)
    )
  }

  onTokenHolders(
    tokenAddress: string,
    first: number,
    skip: number,
    callback: SubscriptionCallback<TokenHolder[]>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<TokenHolder[]>(
      queries.TOKEN_HOLDERS('subscription'),
      { tokenAddress, first, skip },
      callback,
      (result) => parseTokenHolders(result)
    )
  }
}
