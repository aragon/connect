import { subscription } from '@aragon/connect-core'
import { Address, SubscriptionCallback, SubscriptionResult } from '@aragon/connect-types'

import TokenBalance from './TokenBalance'
import { IVaultConnector } from '../types'

export default class Vault {
  #appAddress: Address
  #connector: IVaultConnector

  constructor(connector: IVaultConnector, appAddress: Address) {
    this.#appAddress = appAddress
    this.#connector = connector
  }

  async disconnect() {
    await this.#connector.disconnect()
  }

  async tokenBalances({ first = 1000, skip = 0 } = {}): Promise<TokenBalance[]> {
    return this.#connector.tokenBalances(this.#appAddress, first, skip)
  }

  onTokenBalances(
    { first = 1000, skip = 0 } = {},
    callback?: SubscriptionCallback<TokenBalance[]>
  ): SubscriptionResult<TokenBalance[]> {
    return subscription<TokenBalance[]>(callback, (callback) =>
      this.#connector.onTokenBalances(
        this.#appAddress,
        first,
        skip,
        callback
      )
    )
  }
}
