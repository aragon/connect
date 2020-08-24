import {
  Address,
  SubscriptionCallback,
  SubscriptionResult,
} from '@aragon/connect-types'
import { subscription } from '@aragon/connect-core'
import { ITokensConnector } from '../types'
import Token from './Token'
import TokenHolder from './TokenHolder'

export default class Tokens {
  #appAddress: Address
  #connector: ITokensConnector

  constructor(connector: ITokensConnector, appAddress: Address) {
    this.#appAddress = appAddress
    this.#connector = connector
  }

  async disconnect() {
    await this.#connector.disconnect()
  }

  async token(): Promise<Token> {
    return this.#connector.token()
  }

  async holders({ first = 1000, skip = 0 } = {}): Promise<TokenHolder[]> {
    const token = await this.token()
    return this.#connector.tokenHolders(token.address, first, skip)
  }

  onHolders(
    callback?: SubscriptionCallback<TokenHolder[]>
  ): SubscriptionResult<TokenHolder[]> {
    return subscription<TokenHolder[]>(callback, (callback) =>
      this.#connector.onTokenHolders(this.#appAddress, callback)
    )
  }
}
