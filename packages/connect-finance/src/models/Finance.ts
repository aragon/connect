import {
  Address,
  SubscriptionCallback,
  SubscriptionResult,
} from '@aragon/connect-types'
import { subscription } from '@aragon/connect-core'
import Transaction from './Transaction'
import TokenBalance from './TokenBalance'
import { IFinanceConnector } from '../types'

export default class Finance {
  #appAddress: Address
  #connector: IFinanceConnector

  constructor(connector: IFinanceConnector, appAddress: Address) {
    this.#appAddress = appAddress
    this.#connector = connector
  }

  async disconnect() {
    await this.#connector.disconnect()
  }

  async transactions({ first = 1000, skip = 0 } = {}): Promise<Transaction[]> {
    return this.#connector.transactionsForApp(this.#appAddress, first, skip)
  }

  onTransactions(
    { first = 1000, skip = 0 } = {},
    callback?: SubscriptionCallback<Transaction[]>
  ): SubscriptionResult<Transaction[]> {
    return subscription<Transaction[]>(callback, (callback) =>
      this.#connector.onTransactionsForApp(
        this.#appAddress,
        first,
        skip,
        callback
      )
    )
  }

  async balance(
    tokenAddress: string,
    { first = 1000, skip = 0 } = {}
  ): Promise<TokenBalance> {
    return this.#connector.balanceForToken(
      this.#appAddress,
      tokenAddress,
      first,
      skip
    )
  }

  onBalance(
    tokenAddress: string,
    { first = 1000, skip = 0 } = {},
    callback?: SubscriptionCallback<TokenBalance>
  ): SubscriptionResult<TokenBalance> {
    return subscription<TokenBalance>(callback, (callback) =>
      this.#connector.onBalanceForToken(
        this.#appAddress,
        tokenAddress,
        first,
        skip,
        callback
      )
    )
  }
}
