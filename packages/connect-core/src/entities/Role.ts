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
  #created!: boolean
  appAddress!: string
  description?: string
  hash!: string
  params?: string[]
  permissions?: Permission[] | null
  manager?: string
  name?: string

  constructor(connector: ConnectorInterface) {
    super(connector)

    this.#created = false
  }

  get created(): boolean {
    return this.#created
  }

  async create({ artifact, contentUri, ...data }: RoleData): Promise<void> {
    if (!this.#created) {
      this.#created = true

      const { roles }: AragonArtifact = await resolveMetadata(
        'artifact.json',
        contentUri || undefined,
        artifact
      )

      const role = roles.find(role => role.bytes === data.hash)

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
  }
}
