import { ConnectionContext } from '../types'
import CoreEntity from './CoreEntity'
import App from './App'
import Role from './Role'

export interface ParamData {
  argumentId: number
  operationType: number
  argumentValue: BigInt
}

export interface PermissionData {
  allowed: boolean
  appAddress: string
  granteeAddress: string
  params: ParamData[]
  roleHash: string
}

export default class Permission extends CoreEntity implements PermissionData {
  readonly allowed!: boolean
  readonly appAddress!: string
  readonly granteeAddress!: string
  readonly params!: ParamData[]
  readonly roleHash!: string

  constructor(data: PermissionData, connection: ConnectionContext) {
    super(connection)

    this.allowed = data.allowed
    this.appAddress = data.appAddress
    this.granteeAddress = data.granteeAddress
    this.params = data.params
    this.roleHash = data.roleHash
  }

  async getApp(): Promise<App> {
    return this.orgConnector.appByAddress(this.appAddress)
  }

  async getRole(): Promise<Role | undefined> {
    const roles = await this.orgConnector.rolesForAddress(this.appAddress)
    return roles.find(role => role.hash === this.roleHash)
  }
}
