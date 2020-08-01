import { SubscriptionHandler } from '@aragon/connect-types'
import Token from './entities/Token'
import TokenHolder from './entities/TokenHolder'

export interface ITokensConnector {
  disconnect(): Promise<void>
  token(): Promise<Token>
  tokenHolders(
    tokenAddress: string,
    first: number,
    skip: number
  ): Promise<TokenHolder[]>
  onTokenHolders(tokenAddress: string, callback: Function): SubscriptionHandler
}
