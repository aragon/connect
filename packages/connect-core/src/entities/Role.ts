import CoreEntity from './CoreEntity'
import Permission, { PermissionData } from './Permission'
import { AragonArtifact, Metadata } from '../types'
import { resolveArtifact } from '../utils/metadata'
import { ConnectorInterface } from '../connections/ConnectorInterface'

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
    connector: ConnectorInterface
  ) {
    super(connector)

    const { roles } = metadata[0] as AragonArtifact

    const role = roles?.find(role => role.bytes === data.hash)

    this.appAddress = data.appAddress
    this.description = role?.name
    this.hash = data.hash
    this.params = role?.params
    this.permissions = data.grantees?.map(
      grantee => new Permission(grantee, this._connector)
    )
    this.manager = data.manager
    this.name = role?.id
  }

  static async create(
    data: RoleData,
    connector: ConnectorInterface
  ): Promise<Role> {
    const artifact = await resolveArtifact(data)

    const metadata: Metadata = [artifact]

    return new Role(data, metadata, connector)
  }
}
