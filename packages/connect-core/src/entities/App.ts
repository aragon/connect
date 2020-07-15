import Repo from './Repo'
import Role from './Role'
import CoreEntity from './CoreEntity'
import {
  Abi,
  AppIntent,
  AragonArtifact,
  AragonManifest,
  ConnectionContext,
  Metadata,
} from '../types'
import { resolveManifest, resolveArtifact } from '../utils/metadata'
import IOrganizationConnector from '../connections/IOrganizationConnector'
// import IAppConnected from '../connections/IAppConnected'

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
  readonly name?: string
  readonly registry?: string
  readonly registryAddress!: string
  readonly repoAddress?: string
  readonly version?: string
  #metadata!: Metadata

  constructor(
    data: AppData,
    metadata: Metadata,
    connection: ConnectionContext
  ) {
    super(connection)

    this.address = data.address
    this.appId = data.appId
    this.codeAddress = data.codeAddress
    this.contentUri = data.contentUri || undefined
    this.isForwarder = data.isForwarder ?? undefined
    this.isUpgradeable = data.isUpgradeable ?? undefined
    this.kernelAddress = data.kernelAddress
    this.name = data.name
    this.registry = data.registry || undefined
    this.registryAddress = data.registryAddress
    this.repoAddress = data.repoAddress
    this.version = data.version

    this.#metadata = metadata
  }

  static async create(
    data: AppData,
    connection: ConnectionContext
  ): Promise<App> {
    const artifact = await resolveArtifact(data)
    const manifest = await resolveManifest(data)

    const metadata: Metadata = [artifact, manifest]

    return new App(data, metadata, connection)
  }

  // `any` should be IAppConnector here, but it the TS type checker restricts
  // it to IAppConnector only in that case, rather than the connector being passed.
  async connect(
    // appConnect: (app: App, connector: IOrganizationConnector) => IAppConnected
    appConnect: (app: App, connector: IOrganizationConnector) => any
  ) {
    if (typeof appConnect !== 'function') {
      throw new Error('The passed value is not an app connector.')
    }
    return appConnect(this, this.orgConnector)
  }

  async repo(): Promise<Repo> {
    return this.orgConnector.repoForApp(this.address)
  }

  async roles(): Promise<Role[]> {
    return this.orgConnector.rolesForAddress(this.address)
  }

  get artifact(): AragonArtifact {
    return this.#metadata[0] as AragonArtifact
  }

  get manifest(): AragonManifest {
    return this.#metadata[1] as AragonManifest
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
