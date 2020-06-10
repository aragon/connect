import TokenManagerConnectorTheGraph from "../connector";

export default class TokensEntity {
  protected _connector: TokenManagerConnectorTheGraph

  constructor(connector: TokenManagerConnectorTheGraph) {
    this._connector = connector
  }
}