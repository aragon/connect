import { ConnectorInterface } from '../connections/ConnectorInterface'

export default class CoreEntity {
  protected _connector: ConnectorInterface

  constructor(connector: ConnectorInterface) {
    this._connector = connector
  }
}
