import { Address, SubscriptionHandler } from '@aragon/connect-types'

import Signer from './Signer'
import Version from './Version'
import { IAgreementConnector } from '../types'

export default class Agreement {
  #appAddress: Address
  #connector: IAgreementConnector

  constructor(connector: IAgreementConnector, appAddress: Address) {
    this.#connector = connector
    this.#appAddress = appAddress
  }

  async disconnect() {
    await this.#connector.disconnect()
  }

  async id(): Promise<string> {
    const data = await this.#connector.agreement(this.#appAddress)
    return data.id
  }

  onId(callback: Function): SubscriptionHandler {
    return this.#connector.onAgreement(this.#appAddress, callback)
  }

  async dao(): Promise<string> {
    const data = await this.#connector.agreement(this.#appAddress)
    return data.dao
  }

  onDao(callback: Function): SubscriptionHandler {
    return this.#connector.onAgreement(this.#appAddress, callback)
  }

  async stakingFactory(): Promise<string> {
    const data = await this.#connector.agreement(this.#appAddress)
    return data.stakingFactory
  }

  onStakingFactory(callback: Function): SubscriptionHandler {
    return this.#connector.onAgreement(this.#appAddress, callback)
  }

  async currentVersion(): Promise<Version> {
    return this.#connector.currentVersion(this.#appAddress)
  }

  onCurrentVersion(callback: Function): SubscriptionHandler {
    return this.#connector.onCurrentVersion(this.#appAddress, callback)
  }

  versionId(versionNumber: string): string {
    return `${this.#appAddress}-version-${versionNumber}`
  }

  async version(versionNumber: string): Promise<Version> {
    return this.#connector.version(this.versionId(versionNumber))
  }

  onVersion(versionNumber: string, callback: Function): SubscriptionHandler {
    return this.#connector.onVersion(this.versionId(versionNumber), callback)
  }

  async versions({ first = 1000, skip = 0 } = {}): Promise<Version[]> {
    return this.#connector.versions(this.#appAddress, first, skip)
  }

  onVersions(callback: Function): SubscriptionHandler {
    return this.#connector.onVersions(this.#appAddress, callback)
  }

  signerId(signerAddress: string): string {
    return `${this.#appAddress}-signer-${signerAddress.toLowerCase()}`
  }

  async signer(signerAddress: string): Promise<Signer> {
    return this.#connector.signer(this.signerId(signerAddress))
  }

  onSigner(signerAddress: string, callback: Function): SubscriptionHandler {
    return this.#connector.onSigner(this.signerId(signerAddress), callback)
  }
}
