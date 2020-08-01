import { Address, SubscriptionHandler } from '@aragon/connect-types'

import Version from './Version'
import { IAgreementConnector } from '../types'

export default class Agreement {
  #appAddress: Address
  #connector: IAgreementConnector

  constructor(connector: IAgreementConnector, appAddress: Address) {
    this.#connector = connector
    this.#appAddress = appAddress
  }

  async dao(): Promise<string> {
    const data = await this.#connector.agreement(this.#appAddress)
    return data.dao
  }

  async stakingFactory(): Promise<string> {
    const data = await this.#connector.agreement(this.#appAddress)
    return data.stakingFactory
  }

  async currentVersion(): Promise<Version> {
    return this.#connector.currentVersion(this.#appAddress)
  }

  onCurrentVersion(callback: Function): SubscriptionHandler {
    return this.#connector.onCurrentVersion(this.#appAddress, callback)
  }

  async version({ versionId = '' } = {}): Promise<Version> {
    return this.#connector.version(versionId)
  }

  onVersion(versionId: string, callback: Function): SubscriptionHandler {
    return this.#connector.onVersion(versionId, callback)
  }

  async versions({ first = 1000, skip = 0 } = {}): Promise<Version[]> {
    return this.#connector.versions(this.#appAddress, first, skip)
  }

  onVersions(callback: Function): SubscriptionHandler {
    return this.#connector.onVersions(this.#appAddress, callback)
  }
}
