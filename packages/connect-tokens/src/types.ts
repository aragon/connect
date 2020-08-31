import {
  Address,
  SubscriptionCallback,
  SubscriptionHandler,
} from '@aragon/connect-types'
import Token from './models/Token'
import TokenHolder from './models/TokenHolder'

export interface TokenData {
  address: string
  id: string
  name: string
  symbol: string
  totalSupply: string
  transferable: boolean
}

export interface TokenHolderData {
  id: string
  address: Address
  balance: string
}

export interface ITokensConnector {
  disconnect(): Promise<void>
  token(): Promise<Token>
  tokenHolders(
    tokenAddress: string,
    first: number,
    skip: number
  ): Promise<TokenHolder[]>
  onTokenHolders(
    tokenAddress: string,
    first: number,
    skip: number,
    callback: SubscriptionCallback<TokenHolder[]>
  ): SubscriptionHandler
}
