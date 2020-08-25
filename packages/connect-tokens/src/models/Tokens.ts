import {
  Address,
  SubscriptionCallback,
  SubscriptionHandler,
} from '@aragon/connect-types'
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
    callback: SubscriptionCallback<TokenHolder[]>
  ): SubscriptionHandler {
    return this.#connector.onTokenHolders(this.#appAddress, callback)
  }
}
