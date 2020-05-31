import { ConnectorInterface } from './ConnectorInterface'
import Permission from '../entities/Permission'

export type ConnectorJsonConfig = { permissions: Permission[] }

class ConnectorJson implements ConnectorInterface {
  #permissions: Permission[]

  constructor({ permissions }: ConnectorJsonConfig) {
    this.#permissions = permissions
  }

  async permissionsForOrg(): Promise<Permission[]> {
    return this.#permissions
  }
}

export default ConnectorJson
