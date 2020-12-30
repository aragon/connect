import Organization from './Organization'
import Repo from './Repo'
import Role from './Role'
import {
  Abi,
  AppIntent,
  AragonArtifact,
  AragonManifest,
  ConnectionContext,
  Metadata,
} from '../types'
import { resolveArtifact, resolveManifest } from '../utils/metadata'
import IOrganizationConnector from '../connections/IOrganizationConnector'

// TODO:
// [ ] (ipfs) contentUrl 	String 	The HTTP URL of the app content. Uses the IPFS HTTP provider. E.g. http://gateway.ipfs.io/ipfs/QmdLEDDfi…/ (ContentUri passing through the resolver)

export interface AppData {
  address: string
  appId: string
  artifact?: string
  codeAddress: string
  contentUri?: string
  isForwarder?: boolean
  isUpgradeable?: boolean
  kernelAddress: string
  manifest?: string
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
    const artifact = await resolveArtifact(organization.connection.ipfs, data)
    const manifest = await resolveManifest(organization.connection.ipfs, data)
    return new App(data, [artifact, manifest], organization)
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

  toJSON() {
    return {
      ...this,
      // Organization creates a cycling reference that makes
      // the object impossible to pass through JSON.stringify().
      organization: null,
    }
  }
}
