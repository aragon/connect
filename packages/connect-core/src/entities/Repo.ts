import {
  AragonArtifact,
  AragonArtifactRole,
  AragonManifest,
  Metadata,
  RepoData,
} from '../types'
import Organization from './Organization'
import { resolveArtifact, resolveManifest } from '../utils/metadata'

export default class Repo {
  #metadata!: Metadata
  readonly address: string
  readonly contentUri?: string
  readonly lastVersion?: string
  readonly name: string
  readonly registry?: string
  readonly registryAddress?: string

  constructor(data: RepoData, metadata: Metadata) {
    this.#metadata = metadata
    this.address = data.address
    this.contentUri = data.contentUri
    this.lastVersion = data.lastVersion
    this.name = data.name
    this.registry = data.registry
    this.registryAddress = data.registryAddress
  }

  static async create(
    data: RepoData,
    organization: Organization
  ): Promise<Repo> {
    const artifact = await resolveArtifact(organization.connection.ipfs, data)
    const manifest = await resolveManifest(organization.connection.ipfs, data)
    return new Repo(data, [artifact, manifest])
  }

  get artifact(): AragonArtifact {
    return this.#metadata[0] as AragonArtifact
  }

  get manifest(): AragonManifest {
    return this.#metadata[1] as AragonManifest
  }

  get roles(): AragonArtifactRole[] {
    return this.artifact.roles
  }
}
