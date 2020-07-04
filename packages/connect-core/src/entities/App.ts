import Repo from './Repo'
import Role from './Role'
import CoreEntity from './CoreEntity'
import {
  AragonArtifact,
  AragonManifest,
  Metadata,
  Abi,
  AppIntent,
} from '../types'
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

export default class App extends CoreEntity {
  readonly address!: string
  readonly appId!: string
  readonly codeAddress!: string
  readonly contentUri?: string
  readonly isForwarder?: boolean
  readonly isUpgradeable?: boolean
  readonly kernelAddress!: string
  readonly metadata!: Metadata
  readonly name?: string
  readonly registry?: string
  readonly registryAddress!: string
  readonly repoAddress?: string
  readonly version?: string

  constructor(
    data: AppData,
    metadata: Metadata,
    connector: ConnectorInterface
  ) {
    super(connector)

    this.address = data.address
    this.appId = data.appId
    this.codeAddress = data.codeAddress
    this.contentUri = data.contentUri || undefined
    this.isForwarder = data.isForwarder ?? undefined
    this.isUpgradeable = data.isUpgradeable ?? undefined
    this.kernelAddress = data.kernelAddress
    this.metadata = metadata
    this.name = data.name
    this.registry = data.registry || undefined
    this.registryAddress = data.registryAddress
    this.repoAddress = data.repoAddress
    this.version = data.version
  }

  static async create(
    data: AppData,
    connector: ConnectorInterface
  ): Promise<App> {
    const artifact: AragonArtifact = await resolveMetadata(
      'artifact.json',
      data.contentUri || undefined,
      data.artifact
    )

    const manifest: AragonManifest = await resolveMetadata(
      'manifest.json',
      data.contentUri || undefined,
      data.manifest
    )

    const metadata: Metadata = [artifact, manifest]

    return new App(data, metadata, connector)
  }

  async repo(): Promise<Repo> {
    return this._connector.repoForApp(this.address)
  }

  async roles(): Promise<Role[]> {
    return this._connector.rolesForAddress(this.address)
  }

  get artifact(): AragonArtifact {
    return this.metadata[0] as AragonArtifact
  }

  get manifest(): AragonManifest {
    return this.metadata[1] as AragonManifest
  }

  get abi(): Abi {
    return this.artifact.abi
  }

  get intents(): AppIntent[] {
    return this.artifact.functions
  }

  get deprecatedIntents(): { [version: string]: AppIntent[] } {
    return this.artifact.deprecatedFunctions
  }

  get appName(): string {
    return this.artifact.appName
  }
}
