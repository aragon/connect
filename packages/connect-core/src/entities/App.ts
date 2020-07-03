import Repo from './Repo'
import Role from './Role'
import CoreEntity from './CoreEntity'
import { AragonArtifact, AppIntent, Abi, AragonManifest } from '../types'
import { resolveMetadata } from '../utils/metadata'
import { ConnectorInterface } from '../connections/ConnectorInterface'

// TODO:
// [ ] (ipfs) contentUrl 	String 	The HTTP URL of the app content. Uses the IPFS HTTP provider. E.g. http://gateway.ipfs.io/ipfs/QmdLEDDfi…/ (ContentUri passing through the resolver)

export interface AppData {
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

export default class App extends CoreEntity implements AppData {
  #created!: boolean
  abi?: Abi
  address!: string
  appName?: string
  appId!: string
  author?: string
  codeAddress!: string
  contentUri?: string
  contractPath?: string
  deprecatedIntents?: { [version: string]: AppIntent[] }
  description?: string
  icons?: { src: string; sizes: string }[]
  intents?: AppIntent[]
  isForwarder?: boolean
  isUpgradeable?: boolean
  htmlUrl?: string
  kernelAddress!: string
  name?: string
  registry?: string
  registryAddress!: string
  repoAddress?: string
  sourceUrl?: string
  version?: string

  constructor(connector: ConnectorInterface) {
    super(connector)

    this.#created = false
  }

  get created(): boolean {
    return this.#created
  }

  async create({ artifact, manifest, ...data }: AppData): Promise<void> {
    if (!this.#created) {
      this.#created = true

      const {
        appName,
        path,
        functions,
        deprecatedFunctions,
        abi,
      }: AragonArtifact = await resolveMetadata(
        'artifact.json',
        data.contentUri || undefined,
        artifact
      )

      const {
        author,
        description,
        start_url: htmlUrl,
        icons,
        source_url: sourceUrl,
      }: AragonManifest = await resolveMetadata(
        'manifest.json',
        data.contentUri || undefined,
        manifest
      )

      this.abi = abi
      this.address = data.address
      this.appId = data.appId
      this.appName = appName
      this.author = author
      this.codeAddress = data.codeAddress
      this.contentUri = data.contentUri || undefined
      this.contractPath = path
      this.deprecatedIntents = deprecatedFunctions
      this.description = description
      this.icons = icons
      this.intents = functions
      this.isForwarder = data.isForwarder ?? undefined
      this.isUpgradeable = data.isUpgradeable ?? undefined
      this.htmlUrl = htmlUrl
      this.kernelAddress = data.kernelAddress
      this.name = data.name
      this.registry = data.registry || undefined
      this.registryAddress = data.registryAddress
      this.repoAddress = data.repoAddress
      this.version = data.version
      this.sourceUrl = sourceUrl
    }
  }

  async repo(): Promise<Repo> {
    return this._connector.repoForApp(this.address)
  }

  async roles(): Promise<Role[]> {
    return this._connector.rolesForAddress(this.address)
  }
}
