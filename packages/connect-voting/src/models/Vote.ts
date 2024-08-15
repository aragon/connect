import { SubscriptionCallback, SubscriptionResult } from '@aragon/connect-types'
import { subscription } from '@aragon/connect-core'
import { IVotingConnector, VoteData, RewardData } from '../types'
import Cast from './Cast'
import Reward from './Reward'
import Call from './Call'

export default class Vote {
  #connector: IVotingConnector

  readonly id: string
  readonly creator: string
  readonly originalCreator: string
  readonly metadata: string
  readonly executed: boolean
  readonly executedAt: string
  readonly startDate: string
  readonly snapshotBlock: string
  readonly supportRequiredPct: string
  readonly minAcceptQuorum: string
  readonly yea: string
  readonly nay: string
  readonly votingPower: string
  readonly script: string
  readonly spec: string

  constructor(data: VoteData, connector: IVotingConnector) {
    this.#connector = connector

    this.id = data.id
    this.creator = data.creator
    this.originalCreator = data.originalCreator
    this.metadata = data.metadata
    this.executed = data.executed
    this.executedAt = data.executedAt
    this.startDate = data.startDate
    this.snapshotBlock = data.snapshotBlock
    this.supportRequiredPct = data.supportRequiredPct
    this.minAcceptQuorum = data.minAcceptQuorum
    this.yea = data.yea
    this.nay = data.nay
    this.votingPower = data.votingPower
    this.script = data.script
    this.spec = data.spec
  }

  async casts({ first = 1000, skip = 0 } = {}): Promise<Cast[]> {
    return this.#connector.castsForVote(this.id, first, skip)
  }

  onCasts(
    { first = 1000, skip = 0 } = {},
    callback?: SubscriptionCallback<Cast[]>
  ): SubscriptionResult<Cast[]> {
    return subscription<Cast[]>(callback, (callback) =>
      this.#connector.onCastsForVote(this.id, first, skip, callback)
    )
  }

  async rewards({ first = 1000, skip = 0 } = {}): Promise<Reward[]> {
    return this.#connector.rewardsForVote(this.id, first, skip)
  }

  onRewards(
    { first = 1000, skip = 0 } = {},
    callback?: SubscriptionCallback<Reward[]>
  ): SubscriptionResult<Reward[]> {
    return subscription<Reward[]>(callback, (callback) =>
      this.#connector.onRewardsForVote(this.id, first, skip, callback)
    )
  }
  async calls({ first = 1000, skip = 0 } = {}): Promise<Call[]> {
    return this.#connector.callsForVote(this.id, first, skip)
  }

  onCalls(
    { first = 1000, skip = 0 } = {},
    callback?: SubscriptionCallback<Call[]>
  ): SubscriptionResult<Call[]> {
    return subscription<Call[]>(callback, (callback) =>
      this.#connector.onCallsForVote(this.id, first, skip, callback)
    )
  }
}
