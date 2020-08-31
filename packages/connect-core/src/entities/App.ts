import {
  Contract,
  providers as ethersProvider,
  utils as ethersUtils,
} from 'ethers'

import Organization from './Organization'
import Repo from './Repo'
import Role from './Role'
import {
  Abi,
  AppMethod,
  AragonArtifact,
  AragonManifest,
  Metadata,
  AppData,
  PathOptions,
} from '../types'
import { appIntent } from '../utils/intent'
import { resolveManifest, resolveArtifact } from '../utils/metadata'
import IOrganizationConnector from '../connections/IOrganizationConnector'
import ForwardingPath from './ForwardingPath'

// TODO:
// [ ] (ipfs) contentUrl 	String 	The HTTP URL of the app content. Uses the IPFS HTTP provider. E.g. http://gateway.ipfs.io/ipfs/QmdLEDDfi…/ (ContentUri passing through the resolver)

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

  private orgProvider(): ethersProvider.Provider {
    return this.organization.connection.ethersProvider
  }

  get appName(): string {
    return this.artifact.appName
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

  get methods(): AppMethod[] {
    return this.artifact.functions
  }

  get deprecatedMethods(): { [version: string]: AppMethod[] } {
    return this.artifact.deprecatedFunctions
  }

  contract(): Contract {
    if (!this.abi) {
      throw new Error(
        `No ABI specified in app for ${this.address}. Make sure the metada for the app is available`
      )
    }
    return new Contract(this.address, this.abi, this.orgProvider())
  }

  interface(): ethersUtils.Interface {
    if (!this.abi) {
      throw new Error(
        `No ABI specified in app for ${this.address}. Make sure the metada for the app is available`
      )
    }
    return new ethersUtils.Interface(this.abi)
  }

  /**
   * Calculate the transaction path for a transaction to `destination`
   * that invokes `methodSignature` with `params`.
   *
   * @param  {string} methodSignature
   * @param  {Array<*>} params
   * @return {Promise<Array<Object>>} An array of Ethereum transactions that describe each step in the path
   */
  async intent(
    methodSignature: string,
    params: any[],
    options: PathOptions
  ): Promise<ForwardingPath | undefined> {
    const sender = options.actAs || this.organization.connection.actAs
    if (!sender) {
      throw new Error(
        `No sender address specified. Use 'actAs' option or set one as default on your organization connection.`
      )
    }

    const installedApps = await this.orgConnector().appsForOrg(
      this.organization
    )

    return appIntent(
      sender,
      this,
      methodSignature,
      params,
      installedApps,
      this.orgProvider()
    )
  }

  async repo(): Promise<Repo> {
    return this.orgConnector().repoForApp(this.organization, this.address)
  }

  async roles(): Promise<Role[]> {
    return this.orgConnector().rolesForAddress(this.organization, this.address)
  }
}
