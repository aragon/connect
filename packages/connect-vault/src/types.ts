import { Address, SubscriptionCallback, SubscriptionHandler } from '@aragon/connect-types'

import TokenBalance from './models/TokenBalance'

export interface TokenData {
  id: Address
  name: string
  symbol: string
  decimals: number
}

export interface TokenBalanceData {
  id: string
  token: TokenData
  balance: string
}

export interface IVaultConnector {
  disconnect(): Promise<void>
  tokenBalances(
    appAddress: string,
    first: number,
    skip: number
  ): Promise<TokenBalance[]>
  onTokenBalances(
    appAddress: string,
    first: number,
    skip: number,
    callback: SubscriptionCallback<TokenBalance[]>
  ): SubscriptionHandler
}
