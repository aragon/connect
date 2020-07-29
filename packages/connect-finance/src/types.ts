import { SubscriptionHandler } from '@aragon/connect-types'
import Transaction from './entities/Transaction'
import TokenBalance from './entities/TokenBalance'

export interface IFinanceConnector {
  disconnect(): Promise<void>
  transactionsForApp(
    appAddress: string,
    first: number,
    skip: number
  ): Promise<Transaction[]>
  onTransactionsForApp(
    appAddress: string,
    callback: Function,
    first: number,
    skip: number
  ): SubscriptionHandler
  balanceForToken(
    appAddress: string,
    tokenAddress: string,
    first: number,
    skip: number
  ): Promise<TokenBalance>
  onBalanceForToken(
    appAddress: string,
    tokenAddress: string,
    callback: Function,
    first: number,
    skip: number
  ): SubscriptionHandler
}
