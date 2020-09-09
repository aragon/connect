import {
  Contract,
  providers as ethersProvider,
  utils as ethersUtils,
} from 'ethers'

import { appIntent } from '../utils/intent'
import { resolveManifest, resolveArtifact } from '../utils/metadata'
import {
  Abi,
  AragonArtifact,
  AragonManifest,
  Metadata,
  AppData,
  PathOptions,
} from '../types'
import ForwardingPath from './ForwardingPath'
import Organization from './Organization'
import Repo from './Repo'
import Role from './Role'
import IOrganizationConnector from '../connections/IOrganizationConnector'

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

  get provider(): ethersProvider.Provider {
    return this.organization.connection.ethersProvider
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

  async repo(): Promise<Repo> {
    return this.orgConnector().repoForApp(this.organization, this.address)
  }

  async roles(): Promise<Role[]> {
    return this.orgConnector().rolesForAddress(this.organization, this.address)
  }

  toJSON() {
    return {
      ...this,
      // Organization creates a cycling reference that makes
      // the object impossible to pass through JSON.stringify().
      organization: null,
    }
  }

  contract(): Contract {
    if (!this.abi) {
      throw new Error(
        `No ABI specified in app for ${this.address}. Make sure the metada for the app is available`
      )
    }
    return new Contract(this.address, this.abi, this.provider)
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
   * Calculate the forwarding path for an app action
   * that invokes `methodSignature` with `params`.
   *
   * @param  {string} methodSignature
   * @param  {Array<*>} params
   * @param  {Object} options
   * @return {Promise<ForwardingPath>} An object that represents the forwarding path corresponding to an action.
   */
  async intent(
    methodSignature: string,
    params: any[],
    options: PathOptions
  ): Promise<ForwardingPath> {
    const sender = options.actAs || this.organization.connection.actAs
    if (!sender) {
      throw new Error(
        `No sender address specified. Use 'actAs' option or set one as default on your organization connection.`
      )
    }

    const installedApps = await this.organization.apps()

    return appIntent(
      sender,
      this,
      methodSignature,
      params,
      installedApps,
      this.provider
    )
  }
}
