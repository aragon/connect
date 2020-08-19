import IOrganizationConnector from '../connections/IOrganizationConnector'
import App from './App'
import Organization from './Organization'
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

export default class Permission implements PermissionData {
  #organization: Organization
  readonly allowed!: boolean
  readonly appAddress!: string
  readonly granteeAddress!: string
  readonly params!: ParamData[]
  readonly roleHash!: string

  constructor(data: PermissionData, organization: Organization) {
    this.#organization = organization

    this.allowed = data.allowed
    this.appAddress = data.appAddress
    this.granteeAddress = data.granteeAddress
    this.params = data.params
    this.roleHash = data.roleHash
  }

  private orgConnector(): IOrganizationConnector {
    return this.#organization.connection.orgConnector
  }

  async app(): Promise<App> {
    return this.orgConnector().appByAddress(this.#organization, this.appAddress)
  }

  async role(): Promise<Role | undefined> {
    const roles = await this.orgConnector().rolesForAddress(
      this.#organization,
      this.appAddress
    )
    return roles.find((role) => role.hash === this.roleHash)
  }
}
