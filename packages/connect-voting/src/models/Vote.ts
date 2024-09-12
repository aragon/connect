import { SubscriptionCallback, SubscriptionResult } from '@aragon/connect-types'
import { subscription } from '@aragon/connect-core'
import { IVotingConnector, VoteData, VoteStatus } from '../types'
import Cast from './Cast'
import { bn, currentTimestampEvm } from '../helpers'

export default class Vote {
  #connector: IVotingConnector

  readonly id: string
  readonly creator: string
  readonly originalCreator: string
  readonly metadata: string
  readonly executed: boolean
  readonly executedAt: string
  readonly startDate: string
  readonly endDate: string
  readonly snapshotBlock: string
  readonly supportRequiredPct: string
  readonly minAcceptQuorum: string
  readonly yea: string
  readonly nay: string
  readonly votingPower: string
  readonly script: string
  readonly isAccepted: boolean

  constructor(data: VoteData, connector: IVotingConnector) {
    this.#connector = connector

    this.id = data.id
    this.creator = data.creator
    this.originalCreator = data.originalCreator
    this.metadata = data.metadata
    this.executed = data.executed
    this.executedAt = data.executedAt
    this.startDate = data.startDate
    this.endDate = data.endDate
    this.snapshotBlock = data.snapshotBlock
    this.supportRequiredPct = data.supportRequiredPct
    this.minAcceptQuorum = data.minAcceptQuorum
    this.yea = data.yea
    this.nay = data.nay
    this.votingPower = data.votingPower
    this.script = data.script
    this.isAccepted = data.isAccepted
  }

  get status(): VoteStatus {
    const currentTimestamp = currentTimestampEvm()

    if (!this.executed) {
      if (currentTimestamp.gte(bn(this.endDate))) {
        return this.isAccepted ? VoteStatus.Accepted : VoteStatus.Rejected
      }
      
      return VoteStatus.Ongoing
    }

    return VoteStatus.Executed
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
