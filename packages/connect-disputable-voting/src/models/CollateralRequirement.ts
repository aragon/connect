import { subscription } from '@aragon/connect-core'
import { SubscriptionCallback, SubscriptionResult } from '@aragon/connect-types'

import ERC20 from './ERC20'
import { formatBn } from '../helpers'
import { CollateralRequirementData, IDisputableVotingConnector } from '../types'

export default class CollateralRequirement {
  #connector: IDisputableVotingConnector

  readonly id: string
  readonly voteId: string
  readonly tokenId: string
  readonly tokenDecimals: string
  readonly actionAmount: string
  readonly challengeAmount: string
  readonly challengeDuration: string

  constructor(
    data: CollateralRequirementData,
    connector: IDisputableVotingConnector
  ) {
    this.#connector = connector

    this.id = data.id
    this.voteId = data.voteId
    this.tokenId = data.tokenId
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
