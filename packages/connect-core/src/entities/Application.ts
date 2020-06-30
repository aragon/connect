import Repository from './Repository'
import Role from './Role'
import CoreEntity from './CoreEntity'
import { AragonArtifact, AppIntent, Abi, AragonManifest } from '../types'
import { resolveMetadata } from '../utils/metadata'
import { ConnectorInterface } from '../connections/ConnectorInterface'

// TODO:
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
  readonly address!: string
  readonly appId!: string
  readonly codeAddress!: string
  readonly contentUri?: string
  readonly isForwarder?: boolean
  readonly isUpgradeable?: boolean
  readonly kernelAddress!: string
  readonly name?: string
  readonly registryAddress!: string
  readonly registry?: string
  readonly repoAddress?: string
  readonly version?: string
  #artifact?: string | null
  #manifest?: string | null
  abi?: Abi
  appName?: string
  author?: string
  contractPath?: string
  deprecatedIntents?: { [version: string]: AppIntent[] }
  description?: string
  icons?: { src: string; sizes: string }[]
  intents?: AppIntent[]
  htmlUrl?: string
  sourceUrl?: string

  constructor(data: ApplicationData, connector: ConnectorInterface) {
    super(connector)

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
    this.#artifact = data.artifact
    this.#manifest = data.manifest
  }

  async _init(): Promise<void> {
    const {
      appName,
      path,
      functions,
      deprecatedFunctions,
      abi,
    }: AragonArtifact = await resolveMetadata(
      'artifact.json',
      this.contentUri!,
      this.#artifact
    )

    const {
      author,
      description,
      start_url: htmlUrl,
      icons,
      source_url: sourceUrl,
    }: AragonManifest = await resolveMetadata(
      'manifest.json',
      this.contentUri!,
      this.#manifest
    )

    this.abi = abi
    this.appName = appName
    this.author = author
    this.contractPath = path
    this.deprecatedIntents = deprecatedFunctions
    this.description = description
    this.icons = icons
    this.intents = functions
    this.htmlUrl = htmlUrl
    this.sourceUrl = sourceUrl
  }

  async repo(): Promise<Repository> {
    const repo = await this._connector.repoForApp(this.address)
    await repo._init()
    return repo
  }

  async roles(): Promise<Role[]> {
    const roles = await this._connector.rolesForAddress(this.address)
    await Promise.all(
      roles.map(async role => {
        role._init()
        return role
      })
    )
    return roles
  }
}
