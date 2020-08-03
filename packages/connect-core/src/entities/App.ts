import Organization from './Organization'
import Repo from './Repo'
import Role from './Role'
import {
  Abi,
  AppIntent,
  AragonArtifact,
  AragonManifest,
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
  contentUri?: string
  isForwarder?: boolean
  isUpgradeable?: boolean
  kernelAddress: string
  manifest?: string | null
  name?: string
  registry?: string
  registryAddress: string
  repoAddress?: string
  version?: string
}

export default class App {
  #metadata: Metadata
  readonly address: string
  readonly appId: string
  readonly codeAddress: string
  readonly contentUri?: string
  readonly isForwarder?: boolean
  readonly isUpgradeable?: boolean
  readonly kernelAddress: string
  readonly name?: string
  readonly organization: Organization
  readonly registry?: string
  readonly registryAddress: string
  readonly repoAddress?: string
  readonly version?: string

  constructor(data: AppData, metadata: Metadata, organization: Organization) {
    this.#metadata = metadata
    this.address = data.address
    this.appId = data.appId
    this.codeAddress = data.codeAddress
    this.contentUri = data.contentUri
    this.isForwarder = data.isForwarder
    this.isUpgradeable = data.isUpgradeable
    this.kernelAddress = data.kernelAddress
    this.name = data.name
    this.organization = organization
    this.registry = data.registry
    this.registryAddress = data.registryAddress
    this.repoAddress = data.repoAddress
    this.version = data.version
  }

  static async create(data: AppData, organization: Organization): Promise<App> {
    const artifact = await resolveArtifact(data)
    const manifest = await resolveManifest(data)
    const metadata: Metadata = [artifact, manifest]
    return new App(data, metadata, organization)
  }

  private orgConnector(): IOrganizationConnector {
    return this.organization.connection.orgConnector
  }

  async repo(): Promise<Repo> {
    return this.orgConnector().repoForApp(this.organization, this.address)
  }

  async roles(): Promise<Role[]> {
    return this.orgConnector().rolesForAddress(this.organization, this.address)
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
