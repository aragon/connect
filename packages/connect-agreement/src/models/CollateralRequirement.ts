import { SubscriptionCallback, SubscriptionResult } from '@aragon/connect-types'
import { subscription } from '@aragon/connect-core'
import { CollateralRequirementData, IAgreementConnector } from '../types'
import ERC20 from './ERC20'
import { formatBn } from '../helpers'

export default class CollateralRequirement {
  #connector: IAgreementConnector

  readonly id: string
  readonly disputableAppId: string
  readonly tokenId: string
  readonly tokenSymbol: string
  readonly tokenDecimals: string
  readonly actionAmount: string
  readonly challengeAmount: string
  readonly challengeDuration: string

  constructor(data: CollateralRequirementData, connector: IAgreementConnector) {
    this.#connector = connector

    this.id = data.id
    this.disputableAppId = data.disputableAppId
    this.tokenId = data.tokenId
    this.tokenSymbol = data.tokenSymbol
    this.tokenDecimals = data.tokenDecimals
    this.actionAmount = data.actionAmount
    this.challengeAmount = data.challengeAmount
    this.challengeDuration = data.challengeDuration
  }

  get formattedActionAmount(): string {
    return formatBn(this.actionAmount, this.tokenDecimals)
  }

  get formattedChallengeAmount(): string {
    return formatBn(this.challengeAmount, this.tokenDecimals)
  }

  async token(): Promise<ERC20> {
    return this.#connector.ERC20(this.tokenId)
  }

  onToken(callback?: SubscriptionCallback<ERC20>): SubscriptionResult<ERC20> {
    return subscription<ERC20>(callback, (callback) =>
      this.#connector.onERC20(this.tokenId, callback)
    )
  }
}
