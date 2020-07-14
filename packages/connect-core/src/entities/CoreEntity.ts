import IOrganizationConnector from '../connections/IOrganizationConnector'

export default class CoreEntity {
  protected _connector: IOrganizationConnector

  constructor(connector: IOrganizationConnector) {
    this._connector = connector
  }
}
