import { SubscriptionHandler } from '@aragon/connect-types'
import { GraphQLWrapper } from '@aragon/connect-thegraph'
import * as queries from './queries'
import Token from './entities/Token'
import TokenHolder from './entities/TokenHolder'
import { parseToken, parseTokenHolders } from './parsers'

export default class TokenManagerConnectorTheGraph extends GraphQLWrapper {
  async connect() {}

  async disconnect() {
    this.close()
  }

  async token(tokenManagerAddress: string): Promise<Token> {
    return this.performQueryWithParser(
      queries.TOKEN('query'),
      { tokenManagerAddress },
      parseToken
    )
  }

  async tokenHolders(
    tokenAddress: string,
    first: number,
    skip: number
  ): Promise<TokenHolder[]> {
    return this.performQueryWithParser(
      queries.TOKEN_HOLDERS('query'),
      { tokenAddress, first, skip },
      parseTokenHolders
    )
  }

  onTokenHolders(
    tokenAddress: string,
    callback: Function
  ): SubscriptionHandler {
    return this.subscribeToQueryWithParser(
      queries.TOKEN_HOLDERS('subscription'),
      { tokenAddress, first: 1000, skip: 0 },
      callback,
      parseTokenHolders
    )
  }
}
