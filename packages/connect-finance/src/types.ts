import { SubscriptionHandler, Address } from '@aragon/connect-types'
import Transaction from './models/Transaction'
import TokenBalance from './models/TokenBalance'

export interface TransactionData {
  id: string
  token: Address
  entity: Address
  isIncoming: boolean
  amount: string
  date: string
  reference: string
}

export interface TokenBalanceData {
  id: string
  token: Address
  balance: string
}

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
