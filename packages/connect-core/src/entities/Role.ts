import CoreEntity from './CoreEntity'
import Permission, { PermissionData } from './Permission'
import { AragonArtifact } from '../types'
import { resolveMetadata } from '../utils/metadata'
import { ConnectorInterface } from '../connections/ConnectorInterface'

export interface RoleData {
  appAddress: string
  artifact?: string | null
  contentUri?: string | null
  hash: string
  manager?: string
  grantees?: PermissionData[] | null
}

export default class Role extends CoreEntity implements RoleData {
  readonly appAddress!: string
  readonly hash!: string
  readonly permissions?: Permission[] | null
  readonly manager?: string
  readonly params?: string
  #artifact?: string | null
  #contentUri?: string
  description?: string
  name?: string

  constructor(data: RoleData, connector: ConnectorInterface) {
    super(connector)

    this.appAddress = data.appAddress
    this.hash = data.hash
    this.permissions = data.grantees?.map(
      grantee => new Permission(grantee, connector)
    )
    this.manager = data.manager
    this.#artifact = data.artifact
    this.#contentUri = data.contentUri ?? undefined
  }

  async _init(): Promise<void> {
    const { roles }: AragonArtifact = await resolveMetadata(
      'artifact.json',
      this.#contentUri!,
      this.#artifact
    )

    const role = roles.find(role => role.bytes === this.hash)

    this.name = role?.id
    this.description = role?.name
  }
}
