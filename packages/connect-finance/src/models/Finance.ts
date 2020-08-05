import { Address, SubscriptionHandler } from '@aragon/connect-types'
import { IFinanceConnector } from '../types'
import Transaction from './Transaction'
import TokenBalance from './TokenBalance'

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
    callback: Function
  ): SubscriptionHandler {
    return this.#connector.onTransactionsForApp!(
      this.#appAddress,
      callback,
      first,
      skip
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
    callback: Function
  ): SubscriptionHandler {
    return this.#connector.onBalanceForToken!(
      this.#appAddress,
      tokenAddress,
      callback,
      first,
      skip
    )
  }
}
