import { CollateralRequirementData, IDisputableVotingConnector } from '../types'

export default class CollateralRequirement {
  #connector: IDisputableVotingConnector

  readonly id: string
  readonly voteId: string
  readonly token: string
  readonly actionAmount: string
  readonly challengeAmount: string
  readonly challengeDuration: string

  constructor(data: CollateralRequirementData, connector: IDisputableVotingConnector) {
    this.#connector = connector

    this.id = data.id
    this.voteId = data.voteId
    this.token = data.token
    this.actionAmount = data.actionAmount
    this.challengeAmount = data.challengeAmount
    this.challengeDuration = data.challengeDuration
  }
}
