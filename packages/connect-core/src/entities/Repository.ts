import CoreEntity from './CoreEntity'
import {
  AragonArtifact,
  AragonManifest,
  AragonEnvironments,
  AragonArtifactRole,
} from '../types'
import { parseMetadata } from '../utils/parseMetadata'
import { ConnectorInterface } from '../connections/ConnectorInterface'

export interface RepositoryData {
  address: string
  artifact?: string | null
  contentUri?: string | null
  name: string
  manifest?: string | null
  registry?: string | null
  registryAddress?: string | null
}

export default class Repository extends CoreEntity implements RepositoryData {
  readonly address!: string
  readonly author?: string
  readonly changelogUrl?: string
  readonly descriptionUrl?: string
  readonly description?: string
  readonly environments?: AragonEnvironments
  readonly icons?: { src: string; sizes: string }[]
  readonly name!: string
  readonly registry?: string | null
  readonly registryAddress?: string | null
  readonly roles?: AragonArtifactRole[]
  readonly screenshots?: { src: string }[]
  readonly sourceUrl?: string

  constructor(
    { artifact, manifest, ...data }: RepositoryData,
    connector: ConnectorInterface
  ) {
    super(connector)

    // TODO: If no metadata, fallback to resolve ourselves with ipfs

    if (artifact) {
      const { environments, roles }: AragonArtifact = parseMetadata(
        artifact,
        'artifact.json'
      )

      this.environments = environments
      this.roles = roles
    }

    if (manifest) {
      const {
        author,
        changelog_url: changelogUrl,
        description,
        details_url: descriptionUrl,
        icons,
        screenshots,
        source_url: sourceUrl,
      }: AragonManifest = parseMetadata(manifest, 'manifest.json')

      this.author = author
      this.changelogUrl = changelogUrl
      this.description = description
      this.descriptionUrl = descriptionUrl
      this.icons = icons
      this.screenshots = screenshots
      this.sourceUrl = sourceUrl
    }

    this.address = data.address
    this.name = data.name
    this.registry = data.registry
    this.registryAddress = data.registryAddress
  }
}
