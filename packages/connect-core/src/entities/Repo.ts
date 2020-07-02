import CoreEntity from './CoreEntity'
import {
  AragonArtifact,
  AragonManifest,
  AragonEnvironments,
  AragonArtifactRole,
} from '../types'
import { resolveMetadata } from '../utils/metadata'
import { ConnectorInterface } from '../connections/ConnectorInterface'

export interface RepoData {
  address: string
  artifact?: string | null
  contentUri?: string | null
  name: string
  manifest?: string | null
  registry?: string | null
  registryAddress?: string | null
}

export default class Repo extends CoreEntity implements RepoData {
  readonly address!: string
  readonly contentUri?: string
  readonly name!: string
  readonly registry?: string | null
  readonly registryAddress?: string | null
  #artifact?: string | null
  #manifest?: string | null
  author?: string
  changelogUrl?: string
  description?: string
  descriptionUrl?: string
  environments?: AragonEnvironments
  icons?: { src: string; sizes: string }[]
  roles?: AragonArtifactRole[]
  screenshots?: { src: string }[]
  sourceUrl?: string

  constructor(data: RepoData, connector: ConnectorInterface) {
    super(connector)

    this.address = data.address
    this.contentUri = data.contentUri ?? undefined
    this.name = data.name
    this.registry = data.registry
    this.registryAddress = data.registryAddress
    this.#artifact = data.artifact
    this.#manifest = data.manifest
  }

  async _init(): Promise<void> {
    const { environments, roles }: AragonArtifact = await resolveMetadata(
      'artifact.json',
      this.contentUri!,
      this.#artifact
    )

    const {
      author,
      changelog_url: changelogUrl,
      description,
      details_url: descriptionUrl,
      icons,
      screenshots,
      source_url: sourceUrl,
    }: AragonManifest = await resolveMetadata(
      'manifest.json',
      this.contentUri!,
      this.#manifest
    )

    this.author = author
    this.changelogUrl = changelogUrl
    this.description = description
    this.descriptionUrl = descriptionUrl
    this.environments = environments
    this.icons = icons
    this.roles = roles
    this.screenshots = screenshots
    this.sourceUrl = sourceUrl
  }
}
