import IOrganizationConnector from '../connections/IOrganizationConnector'
import { AragonArtifact, ConnectionContext, Metadata } from '../types'
import { resolveArtifact } from '../utils/metadata'
import CoreEntity from './CoreEntity'
import Permission, { PermissionData } from './Permission'

export interface RoleData {
  appAddress: string
  appId: string
  artifact?: string | null
  contentUri?: string | null
  hash: string
  manager?: string
  grantees?: PermissionData[] | null
}

export default class Role extends CoreEntity {
  readonly appAddress!: string
  readonly appId!: string
  readonly description?: string
  readonly hash!: string
  readonly params?: string[]
  readonly permissions?: Permission[] | null
  readonly manager?: string
  readonly name?: string

  constructor(
    data: RoleData,
    metadata: Metadata,
    connection: ConnectionContext
  ) {
    super(connection)

    const { roles } = metadata[0] as AragonArtifact

    const role = roles?.find(role => role.bytes === data.hash)

    this.appAddress = data.appAddress
    this.description = role?.name
    this.hash = data.hash
    this.params = role?.params
    this.permissions = data.grantees?.map(
      grantee => new Permission(grantee, this.connection)
    )
    this.manager = data.manager
    this.name = role?.id
  }

  static async create(
    data: RoleData,
    connection: ConnectionContext
  ): Promise<Role> {
    const artifact = await resolveArtifact(data)

    const metadata: Metadata = [artifact]

    return new Role(data, metadata, connection)
  }
}
