import { SubscriptionHandler } from '@aragon/connect-types'
import Token from './entities/Token'
import TokenHolder from './entities/TokenHolder'

export interface ITokensConnector {
  token(): Promise<Token>
  tokenHolders(
    tokenAddress: string,
    first: number,
    skip: number
  ): Promise<TokenHolder[]>
  onTokenHolders(tokenAddress: string, callback: Function): SubscriptionHandler
}
