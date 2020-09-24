import { AragonArtifact, ConnectionContext, Metadata } from '../types'
import { resolveArtifact } from '../utils/metadata'
import Organization from './Organization'
import Permission, { PermissionData } from './Permission'

export interface RoleData {
  appAddress: string
  appId: string
  artifact?: string
  contentUri?: string
  hash: string
  manager?: string
  grantees?: PermissionData[] | null
}

export default class Role {
  readonly appAddress!: string
  readonly appId!: string
  readonly description?: string
  readonly hash!: string
  readonly params?: string[]
  readonly permissions?: Permission[] | null
  readonly manager?: string
  readonly name?: string

  constructor(data: RoleData, metadata: Metadata, organization: Organization) {
    const { roles } = metadata[0] as AragonArtifact
    const role = roles?.find((role) => role.bytes === data.hash)

    this.appAddress = data.appAddress
    this.description = role?.name
    this.hash = data.hash
    this.manager = data.manager
    this.name = role?.id
    this.params = role?.params
    this.permissions = data.grantees?.map(
      (grantee) => new Permission(grantee, organization)
    )
  }

  static async create(
    data: RoleData,
    organization: Organization
  ): Promise<Role> {
    const artifact = await resolveArtifact(organization.connection.ipfs, data)
    return new Role(data, [artifact], organization)
  }
}
