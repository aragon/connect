import IOrganizationConnector from '../connections/IOrganizationConnector'
import { ConnectionContext } from '../types'

export default class CoreEntity {
  readonly connection: ConnectionContext
  readonly orgConnector: IOrganizationConnector

  constructor(connection: ConnectionContext) {
    this.connection = connection
    this.orgConnector = connection.orgConnector
  }
}
