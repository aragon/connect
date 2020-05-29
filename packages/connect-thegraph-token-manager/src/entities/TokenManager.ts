import { App } from '@aragon/connect'
import TokenManagerConnectorTheGraph from '../connector'
import Entity from './Entity'
import Token from './Token'

export default class TokenManager extends Entity {
  readonly appAddress: string

  constructor(appAddress: string, subgraphUrl: string) {
    super(new TokenManagerConnectorTheGraph(subgraphUrl))

    this.appAddress = appAddress
  }

  async token(): Promise<Token> {
    return this._connector.token(this.appAddress)
  }
}
