import {
  Address,
  SubscriptionCallback,
  SubscriptionHandler,
} from '@aragon/connect-types'

import Signer from './Signer'
import Version from './Version'
import { IAgreementConnector } from '../types'

export default class Agreement {
  #address: Address
  #connector: IAgreementConnector

  constructor(connector: IAgreementConnector, address: Address) {
    this.#connector = connector
    this.#address = address
  }

  async disconnect() {
    await this.#connector.disconnect()
  }

  async id(): Promise<string> {
    const data = await this.#connector.agreement(this.#address)
    return data.id
  }

  async dao(): Promise<string> {
    const data = await this.#connector.agreement(this.#address)
    return data.dao
  }

  async stakingFactory(): Promise<string> {
    const data = await this.#connector.agreement(this.#address)
    return data.stakingFactory
  }

  async currentVersion(): Promise<Version> {
    return this.#connector.currentVersion(this.#address)
  }

  onCurrentVersion(
    callback: SubscriptionCallback<Version>
  ): SubscriptionHandler {
    return this.#connector.onCurrentVersion(this.#address, callback)
  }

  versionId(versionNumber: string): string {
    return `${this.#address}-version-${versionNumber}`
  }

  async version(versionNumber: string): Promise<Version> {
    return this.#connector.version(this.versionId(versionNumber))
  }

  onVersion(
    versionNumber: string,
    callback: SubscriptionCallback<Version>
  ): SubscriptionHandler {
    return this.#connector.onVersion(this.versionId(versionNumber), callback)
  }

  async versions({ first = 1000, skip = 0 } = {}): Promise<Version[]> {
    return this.#connector.versions(this.#address, first, skip)
  }

  onVersions(
    { first = 1000, skip = 0 } = {},
    callback: SubscriptionCallback<Version[]>
  ): SubscriptionHandler {
    return this.#connector.onVersions(this.#address, first, skip, callback)
  }

  signerId(signerAddress: string): string {
    return `${this.#address}-signer-${signerAddress.toLowerCase()}`
  }

  async signer(signerAddress: string): Promise<Signer> {
    return this.#connector.signer(this.signerId(signerAddress))
  }

  onSigner(
    signerAddress: string,
    callback: SubscriptionCallback<Signer>
  ): SubscriptionHandler {
    return this.#connector.onSigner(this.signerId(signerAddress), callback)
  }
}
