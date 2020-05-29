import Entity from './Entity'
import { PermissionData } from './Permission'
import { AragonArtifact } from '../types'
import { parseMetadata } from '../utils/parseMetadata'
import { ConnectorInterface } from '../connections/ConnectorInterface'

export interface RoleData {
  appAddress: string
  artifact?: string | null
  hash: string
  manager?: string
  grantees?: PermissionData[] | null
}

export default class Role extends Entity implements RoleData {
  readonly appAddress!: string
  readonly description?: string
  readonly grantees?: PermissionData[]
  readonly hash!: string
  readonly name?: string
  readonly manager?: string
  readonly params?: string

  constructor({ artifact, ...data }: RoleData, connector: ConnectorInterface) {
    super(connector)

    // TODO: If no metadata, fallback to resolve ourselves with ipfs

    if (artifact) {
      const { roles }: AragonArtifact = parseMetadata(artifact, 'artifact.json')

      const role = roles.find((role) => role.bytes === data.hash)

      this.name = role?.id
      this.description = role?.name
    }

    Object.assign(this, data)
  }
}
