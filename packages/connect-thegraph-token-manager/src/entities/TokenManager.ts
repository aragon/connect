import { App } from '@aragon/connect-core'
import TokenManagerConnectorTheGraph from '../connector'
import TokensEntity from './TokensEntity'
import Token from './Token'

export default class TokenManager extends TokensEntity {
  readonly appAddress: string

  constructor(appAddress: string, subgraphUrl: string) {
    super(new TokenManagerConnectorTheGraph(subgraphUrl))

    this.appAddress = appAddress
  }

  async token(): Promise<Token> {
    return this._connector.token(this.appAddress)
  }
}
