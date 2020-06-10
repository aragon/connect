import Repository from './Repository'
import Role from './Role'
import CoreEntity from './CoreEntity'
import {
  AragonArtifact,
  AppIntent,
  Abi,
  AragonEnvironment,
  AragonManifest,
} from '../types'
import { parseMetadata } from '../utils/parseMetadata'
import { ConnectorInterface } from '../connections/ConnectorInterface'

// TODO: Implement all properties and methods from the API spec (https://github.com/aragon/connect/blob/master/docs/app.md).
// [ ] (ipfs) contentUrl 	String 	The HTTP URL of the app content. Uses the IPFS HTTP provider. E.g. http://gateway.ipfs.io/ipfs/QmdLEDDfi…/ (ContentUri passing through the resolver)

export interface ApplicationData {
  address: string
  appId: string
  artifact?: string | null
  codeAddress: string
  contentUri?: string | null
  isForwarder?: boolean | null
  isUpgradeable?: boolean | null
  kernelAddress: string
  manifest?: string | null
  name?: string
  registry?: string | null
  registryAddress: string
  repoAddress?: string
  version?: string
}

export default class Application extends CoreEntity implements ApplicationData {
  readonly abi?: Abi
  readonly address!: string
  readonly appId!: string
  readonly appName?: string
  readonly author?: string
  readonly chainId?: AragonEnvironment
  readonly codeAddress!: string
  readonly contentUri?: string
  readonly contentUrl?: string
  readonly contractPath?: string
  readonly description?: string
  readonly htmlPath?: string
  readonly htmlUrl?: string
  readonly intents?: AppIntent[]
  readonly deprecatedIntents?: { [version: string]: AppIntent[] }
  readonly icons?: { src: string; sizes: string }[]
  readonly isForwarder?: boolean
  readonly isUpgradeable?: boolean
  readonly kernelAddress!: string
  readonly name?: string
  readonly registryAddress!: string
  readonly registry?: string
  readonly repoAddress?: string
  readonly sourceUrl?: string
  readonly tags?: string[]
  readonly version?: string

  constructor(
    { artifact, manifest, ...data }: ApplicationData,
    connector: ConnectorInterface
  ) {
    super(connector)

    // TODO: If no metadata, fallback to resolve ourselves with ipfs

    if (artifact) {
      const {
        appName,
        path,
        functions,
        deprecatedFunctions,
        abi,
      }: AragonArtifact = parseMetadata(artifact, 'artifact.json')

      this.appName = appName
      this.contractPath = path
      this.intents = functions
      this.deprecatedIntents = deprecatedFunctions
      this.abi = abi
    }

    if (manifest) {
      const {
        author,
        description,
        start_url: htmlPath,
        icons,
        source_url: sourceUrl,
      }: AragonManifest = parseMetadata(manifest, 'manifest.json')

      this.author = author
      this.description = description
      this.htmlPath = htmlPath
      this.icons = icons
      this.sourceUrl = sourceUrl
    }

    this.address = data.address
    this.appId = data.appId
    this.codeAddress = data.codeAddress
    this.contentUri = data.contentUri ?? undefined
    this.isForwarder = data.isForwarder ?? undefined
    this.isUpgradeable = data.isUpgradeable ?? undefined
    this.kernelAddress = data.kernelAddress
    this.name = data.name
    this.registry = data.registry ?? undefined
    this.registryAddress = data.registryAddress
    this.repoAddress = data.repoAddress
    this.version = data.version
  }

  async repo(): Promise<Repository> {
    return this._connector.repoForApp(this.address)
  }

  async roles(): Promise<Role[]> {
    return this._connector.rolesForAddress(this.address)
  }
}
