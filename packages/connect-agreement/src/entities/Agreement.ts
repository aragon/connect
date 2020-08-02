import { Address, SubscriptionHandler } from '@aragon/connect-types'

import Version from './Version'
import { IAgreementConnector } from '../types'

export default class Agreement {
  address: Address
  connector: IAgreementConnector

  constructor(connector: IAgreementConnector, address: Address) {
    this.connector = connector
    this.address = address
  }

  async dao(): Promise<string> {
    const data = await this.connector.agreement(this.address)
    return data.dao
  }

  async stakingFactory(): Promise<string> {
    const data = await this.connector.agreement(this.address)
    return data.stakingFactory
  }

  async currentVersion(): Promise<Version> {
    return this.connector.currentVersion(this.address)
  }

  onCurrentVersion(callback: Function): SubscriptionHandler {
    return this.connector.onCurrentVersion(this.address, callback)
  }

  async version(versionId: string): Promise<Version> {
    return this.connector.version(this.address, versionId)
  }

  onVersion(versionId: string, callback: Function): SubscriptionHandler {
    return this.connector.onVersion(this.address, versionId, callback)
  }

  async versions({ first = 1000, skip = 0 } = {}): Promise<Version[]> {
    return this.connector.versions(this.address, first, skip)
  }

  onVersions(callback: Function): SubscriptionHandler {
    return this.connector.onVersions(this.address, callback)
  }
}
