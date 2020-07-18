import CoreEntity from './CoreEntity'
import {
  AragonArtifact,
  AragonManifest,
  Metadata,
  AragonArtifactRole,
} from '../types'
import { resolveMetadata, resolveManifest } from '../utils/metadata'
import { ConnectorInterface } from '../connections/ConnectorInterface'

export interface RepoData {
  address: string
  artifact?: string | null
  contentUri?: string
  manifest?: string | null
  name: string
  registry?: string
  registryAddress?: string
}

export default class Repo extends CoreEntity {
  #metadata!: Metadata
  readonly address: string
  readonly contentUri?: string
  readonly name: string
  readonly registry?: string
  readonly registryAddress?: string

  constructor(
    data: RepoData,
    metadata: Metadata,
    connector: ConnectorInterface
  ) {
    super(connector)

    this.#metadata = metadata

    this.address = data.address
    this.contentUri = data.contentUri
    this.name = data.name
    this.registry = data.registry
    this.registryAddress = data.registryAddress
  }

  static async create(
    data: RepoData,
    connector: ConnectorInterface
  ): Promise<Repo> {
    const artifact = await resolveMetadata(
      'artifact.json',
      data.contentUri,
      data.artifact
    )
    const manifest = await resolveManifest(data)

    const metadata: Metadata = [artifact, manifest]

    return new Repo(data, metadata, connector)
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
