import { subscription, App, ForwardingPath } from '@aragon/connect-core'
import {
  SubscriptionCallback,
  SubscriptionResult,
} from '@aragon/connect-types'

import { IAgreementConnector } from '../types'
import Signer from './Signer'
import Version from './Version'
import DisputableApp from './DisputableApp'

export default class Agreement {
  #app: App
  #connector: IAgreementConnector

  readonly address: string

  constructor(connector: IAgreementConnector, app: App) {
    this.#connector = connector
    this.#app = app
    this.address = app.address
  }

  async disconnect() {
    await this.#connector.disconnect()
  }

  async id(): Promise<string> {
    const data = await this.#connector.agreement(this.address)
    return data.id
  }

  async dao(): Promise<string> {
    const data = await this.#connector.agreement(this.address)
    return data.dao
  }

  async stakingFactory(): Promise<string> {
    const data = await this.#connector.agreement(this.address)
    return data.stakingFactory
  }

  async currentVersion(): Promise<Version> {
    return this.#connector.currentVersion(this.address)
  }

  onCurrentVersion(
    callback?: SubscriptionCallback<Version>
  ): SubscriptionResult<Version> {
    return subscription<Version>(callback, (callback) =>
      this.#connector.onCurrentVersion(this.address, callback)
    )
  }

  versionId(versionNumber: string): string {
    return `${this.address}-version-${versionNumber}`
  }

  async version(versionNumber: string): Promise<Version> {
    return this.#connector.version(this.versionId(versionNumber))
  }

  onVersion(
    versionNumber: string,
    callback?: SubscriptionCallback<Version>
  ): SubscriptionResult<Version> {
    return subscription<Version>(callback, (callback) =>
      this.#connector.onVersion(this.versionId(versionNumber), callback)
    )
  }

  async versions({ first = 1000, skip = 0 } = {}): Promise<Version[]> {
    return this.#connector.versions(this.address, first, skip)
  }

  onVersions(
    { first = 1000, skip = 0 } = {},
    callback?: SubscriptionCallback<Version[]>
  ): SubscriptionResult<Version[]> {
    return subscription<Version[]>(callback, (callback) =>
      this.#connector.onVersions(this.address, first, skip, callback)
    )
  }

  async disputableApps({ first = 1000, skip = 0 } = {}): Promise<DisputableApp[]> {
    return this.#connector.disputableApps(this.address, first, skip)
  }

  onDisputableApps(
    { first = 1000, skip = 0 } = {},
    callback?: SubscriptionCallback<DisputableApp[]>
  ): SubscriptionResult<DisputableApp[]> {
    return subscription<DisputableApp[]>(callback, (callback) =>
      this.#connector.onDisputableApps(this.address, first, skip, callback)
    )
  }

  signerId(signerAddress: string): string {
    return `${this.address}-signer-${signerAddress.toLowerCase()}`
  }

  async signer(signerAddress: string): Promise<Signer> {
    return this.#connector.signer(this.signerId(signerAddress))
  }

  onSigner(
    signerAddress: string,
    callback?: SubscriptionCallback<Signer>
  ): SubscriptionResult<Signer> {
    return subscription<Signer>(callback, (callback) =>
      this.#connector.onSigner(this.signerId(signerAddress), callback)
    )
  }

  sign(signerAddress: string, versionNumber: string): Promise<ForwardingPath> {
    return this.#app.intent('sign', [versionNumber], { actAs: signerAddress })
  }
}
