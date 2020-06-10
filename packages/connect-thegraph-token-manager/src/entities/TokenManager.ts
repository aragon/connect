import TokenManagerConnectorTheGraph from '../connector'
import TokensEntity from './TokensEntity'
import Token from './Token'

export default class TokenManager extends TokensEntity {
  readonly appAddress: string

  constructor(appAddress: string, subgraphUrl: string, verbose = false) {
    super(new TokenManagerConnectorTheGraph(subgraphUrl, verbose))

    this.appAddress = appAddress
  }

  async token(): Promise<Token> {
    return this._connector.token(this.appAddress)
  }
}
