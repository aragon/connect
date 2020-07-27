import AgreementConnectorTheGraph from '../connector'

export default class AgreementEntity {
  protected _connector: AgreementConnectorTheGraph

  constructor(connector: AgreementConnectorTheGraph) {
    this._connector = connector
  }
}
