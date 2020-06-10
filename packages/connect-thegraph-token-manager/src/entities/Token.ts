import Entity from "./Entity";
import TokenHolder from "./TokenHolder";
import TokenManagerConnectorTheGraph from "../connector";

export interface TokenData {
  id: string
  address: string
  totalSupply: string
  transferable: boolean
  name: string
  symbol: string
}

export default class Token extends Entity implements TokenData {
  readonly id!: string
  readonly address!: string
  readonly totalSupply!: string
  readonly transferable!: boolean
  readonly name!: string
  readonly symbol!: string

  constructor(data: TokenData, connector: TokenManagerConnectorTheGraph) {
    super(connector)

    Object.assign(this, data)
  }

  async holders({ first = 1000, skip = 0 } = {}): Promise<TokenHolder[]> {
    return this._connector.tokenHolders(
      this.address,
      first,
      skip
    )
  }

  onHolders(callback: Function): { unsubscribe: Function } {
    return this._connector.onTokenHolders(
      this.address,
      callback
    )
  }
}
