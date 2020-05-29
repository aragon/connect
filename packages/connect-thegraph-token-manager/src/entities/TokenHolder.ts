import Entity from "./Entity";
import TokenManagerConnectorTheGraph from "../connector";

export interface TokenHolderData {
  id: string
  address: string
  balance: string
}

export default class TokenHolder extends Entity implements TokenHolderData {
  readonly id!: string
  readonly address!: string
  readonly balance!: string

  constructor(data: TokenHolderData, connector: TokenManagerConnectorTheGraph) {
    super(connector)

    Object.assign(this, data)
  }
}