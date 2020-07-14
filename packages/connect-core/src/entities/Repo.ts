import CoreEntity from './CoreEntity'
import {
  AragonArtifact,
  AragonManifest,
  Metadata,
  AragonArtifactRole,
} from '../types'
import IOrganizationConnector from '../connections/IOrganizationConnector'
import { resolveMetadata, resolveManifest } from '../utils/metadata'

export interface RepoData {
  address: string
  artifact?: string | null
  contentUri?: string | null
  name: string
  manifest?: string | null
  registry?: string | null
  registryAddress?: string | null
}

export default class Repo extends CoreEntity {
  readonly address!: string
  readonly contentUri?: string
  readonly name!: string
  readonly registry?: string | null
  readonly registryAddress?: string | null
  #metadata!: Metadata

  constructor(
    data: RepoData,
    metadata: Metadata,
    connector: IOrganizationConnector
  ) {
    super(connector)

    this.address = data.address
    this.contentUri = data.contentUri || undefined
    this.name = data.name
    this.registry = data.registry
    this.registryAddress = data.registryAddress

    this.#metadata = metadata
  }

  static async create(
    data: RepoData,
    connector: IOrganizationConnector
  ): Promise<Repo> {
    const artifact = await resolveMetadata(
      'artifact.json',
      data.contentUri || undefined,
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
