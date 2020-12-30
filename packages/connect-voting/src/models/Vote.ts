import { SubscriptionCallback, SubscriptionResult } from '@aragon/connect-types'
import { subscription } from '@aragon/connect-core'
import { IVotingConnector, VoteData } from '../types'
import Cast from './Cast'

export default class Vote {
  #connector: IVotingConnector

  readonly id: string
  readonly creator: string
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

  constructor(data: VoteData, connector: IVotingConnector) {
    this.#connector = connector

    this.id = data.id
    this.creator = data.creator
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
}
