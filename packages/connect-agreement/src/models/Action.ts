import { subscription } from '@aragon/connect-core'
import { SubscriptionCallback, SubscriptionResult } from '@aragon/connect-types'

import Version from './Version'
import CollateralRequirement from './CollateralRequirement'
import { IAgreementConnector, ActionData } from '../types'

export default class Action {
  #connector: IAgreementConnector

  readonly id: string
  readonly agreementId: string
  readonly disputableId: string
  readonly disputableActionId: string
  readonly collateralRequirementId: string
  readonly versionId: string
  readonly context: string
  readonly createdAt: string

  constructor(data: ActionData, connector: IAgreementConnector) {
    this.#connector = connector

    this.id = data.id
    this.agreementId = data.agreementId
    this.disputableId = data.disputableId
    this.disputableActionId = data.disputableActionId
    this.collateralRequirementId = data.collateralRequirementId
    this.versionId = data.versionId
    this.context = data.context
    this.createdAt = data.createdAt
  }

  async version(): Promise<Version> {
    return this.#connector.version(this.versionId)
  }

  onVersion(
    callback?: SubscriptionCallback<Version>
  ): SubscriptionResult<Version> {
    return subscription<Version>(callback, (callback) =>
      this.#connector.onVersion(this.versionId, callback)
    )
  }

  async collateralRequirement(): Promise<CollateralRequirement> {
    return this.#connector.collateralRequirement(this.collateralRequirementId)
  }

  onCollateralRequirement(
    callback?: SubscriptionCallback<CollateralRequirement>
  ): SubscriptionResult<CollateralRequirement> {
    return subscription<CollateralRequirement>(callback, (callback) =>
      this.#connector.onCollateralRequirement(this.collateralRequirementId, callback)
    )
  }
}
