import {
  Address,
  SubscriptionCallback,
  SubscriptionHandler,
} from '@aragon/connect-types'
import { ITokensConnector } from '../types'
import Token from './Token'
import TokenHolder from './TokenHolder'

export default class Tokens {
  #connector: ITokensConnector
  #tokenAddress: Address

  constructor(connector: ITokensConnector, tokenAddress: Address) {
    this.#connector = connector
    this.#tokenAddress = tokenAddress
  }

  static async create(connector: ITokensConnector) {
    const token = await connector.token()
    return new Tokens(connector, token.address)
  }

  async disconnect() {
    await this.#connector.disconnect()
  }

  async token(): Promise<Token> {
    return this.#connector.token()
  }

  async holders({ first = 1000, skip = 0 } = {}): Promise<TokenHolder[]> {
    return this.#connector.tokenHolders(this.#tokenAddress, first, skip)
  }

  onHolders(
    { first = 1000, skip = 0 } = {},
    callback: SubscriptionCallback<TokenHolder[]>
  ): SubscriptionHandler {
    return this.#connector.onTokenHolders(
      this.#tokenAddress,
      first,
      skip,
      callback
    )
  }
}
