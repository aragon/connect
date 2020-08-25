import { SubscriptionHandler } from '@aragon/connect-types'

import ERC20 from './ERC20'
import { CollateralRequirementData, IDisputableVotingConnector } from '../types'

export default class CollateralRequirement {
  #connector: IDisputableVotingConnector

  readonly id: string
  readonly voteId: string
  readonly tokenId: string
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
    this.actionAmount = data.actionAmount
    this.challengeAmount = data.challengeAmount
    this.challengeDuration = data.challengeDuration
  }

  async token(): Promise<ERC20> {
    return this.#connector.ERC20(this.tokenId)
  }

  onToken(callback: Function): SubscriptionHandler {
    return this.#connector.onERC20(this.tokenId, callback)
  }
}
