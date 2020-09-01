import { resolveArtifact } from '../utils/metadata'
import { AragonArtifact, Metadata, RoleData } from '../types'
import Organization from './Organization'
import Permission from './Permission'

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
    const artifact = await resolveArtifact(data)
    const metadata: Metadata = [artifact]
    return new Role(data, metadata, organization)
  }
}
