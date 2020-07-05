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
  #created!: boolean
  address!: string
  author?: string
  artifact?: string | null
  changelogUrl?: string
  contentUri?: string
  description?: string
  descriptionUrl?: string
  environments?: AragonEnvironments
  icons?: { src: string; sizes: string }[]
  manifest?: string | null
  name!: string
  registry?: string | null
  registryAddress?: string | null
  roles?: AragonArtifactRole[]
  screenshots?: { src: string }[]
  sourceUrl?: string

  constructor(connector: ConnectorInterface) {
    super(connector)

    this.#created = false
  }

  get created(): boolean {
    return this.#created
  }

  async create({ artifact, manifest, ...data }: RepoData): Promise<void> {
    if (!this.#created) {
      this.#created = true

      const { environments, roles }: AragonArtifact = await resolveMetadata(
        'artifact.json',
        data.contentUri || undefined,
        artifact
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
        data.contentUri || undefined,
        manifest
      )

      this.address = data.address
      this.author = author
      this.artifact = artifact
      this.changelogUrl = changelogUrl
      this.contentUri = data.contentUri || undefined
      this.description = description
      this.descriptionUrl = descriptionUrl
      this.environments = environments
      this.icons = icons
      this.name = data.name
      this.manifest = manifest
      this.registry = data.registry
      this.registryAddress = data.registryAddress
      this.roles = roles
      this.screenshots = screenshots
      this.sourceUrl = sourceUrl
    }
  }
}
