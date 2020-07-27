import { SubscriptionHandler } from '@aragon/connect-types'
import Entity from './AgreementEntity'
import Version from './Version'
import AgreementConnectorTheGraph from '../connector'

export interface AgreementData {
  id: string
  dao: string
  stakingFactory: string
  currentVersionId: string
}

export default class Agreement extends Entity implements AgreementData {
  readonly id!: string
  readonly dao!: string
  readonly stakingFactory!: string
  readonly currentVersionId!: string

  constructor(data: AgreementData, connector: AgreementConnectorTheGraph) {
    super(connector)

    Object.assign(this, data)
  }

  async currentVersion({ first = 1000, skip = 0 } = {}): Promise<Version> {
    return this._connector.version(this.currentVersionId, first, skip)
  }

  onCurrentVersion(callback: Function): SubscriptionHandler {
    return this._connector.onVersion(this.currentVersionId, callback)
  }

  async versions({ first = 1000, skip = 0 } = {}): Promise<Version[]> {
    return this._connector.versions(this.id, first, skip)
  }

  onVersions(callback: Function): SubscriptionHandler {
    return this._connector.onVersions(this.id, callback)
  }
}
