import { SubscriptionCallback, SubscriptionResult } from '@aragon/connect-types'
import { subscription } from '@aragon/connect-core'
import { DisputableAppData, IAgreementConnector } from '../types'
import CollateralRequirement from './CollateralRequirement'

export default class DisputableApp {
  #connector: IAgreementConnector

  readonly id: string
  readonly address: string
  readonly agreementId: string
  readonly collateralRequirementId: string
  readonly activated: boolean

  constructor(data: DisputableAppData, connector: IAgreementConnector) {
    this.#connector = connector

    this.id = data.id
    this.address = data.address
    this.agreementId = data.agreementId
    this.collateralRequirementId = data.collateralRequirementId
    this.activated = data.activated
  }

  async collateralRequirement(): Promise<CollateralRequirement> {
    return this.#connector.collateralRequirement(this.id)
  }

  onCollateralRequirement(
    callback?: SubscriptionCallback<CollateralRequirement>
  ): SubscriptionResult<CollateralRequirement> {
    return subscription<CollateralRequirement>(callback, (callback) =>
      this.#connector.onCollateralRequirement(this.id, callback)
    )
  }
}
