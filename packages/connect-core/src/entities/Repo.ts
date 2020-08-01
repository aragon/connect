import {
  AragonArtifact,
  AragonArtifactRole,
  AragonManifest,
  ConnectionContext,
  Metadata,
} from '../types'
import { resolveMetadata, resolveManifest } from '../utils/metadata'
import Organization from './Organization'

export interface RepoData {
  address: string
  artifact?: string | null
  contentUri?: string
  manifest?: string | null
  name: string
  registry?: string
  registryAddress?: string
}

export default class Repo {
  #metadata!: Metadata
  readonly address: string
  readonly contentUri?: string
  readonly name: string
  readonly registry?: string
  readonly registryAddress?: string

  constructor(data: RepoData, metadata: Metadata, organization: Organization) {
    this.#metadata = metadata

    this.#metadata = metadata

    this.address = data.address
    this.contentUri = data.contentUri
    this.name = data.name
    this.registry = data.registry
    this.registryAddress = data.registryAddress
  }

  static async create(
    data: RepoData,
    organization: Organization
  ): Promise<Repo> {
    const artifact = await resolveMetadata(
      'artifact.json',
      data.contentUri,
      data.artifact
    )
    const manifest = await resolveManifest(data)

    const metadata: Metadata = [artifact, manifest]

    return new Repo(data, metadata, organization)
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
