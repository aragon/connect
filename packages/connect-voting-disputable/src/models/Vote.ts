import { SubscriptionHandler } from '@aragon/connect-types'

import CastVote from './CastVote'
import { IDisputableVotingConnector, VoteData } from '../types'

export default class Vote {
  #connector: IDisputableVotingConnector

  readonly id: string
  readonly votingId: string
  readonly voteId: string
  readonly creator: string
  readonly context: string
  readonly status: string
  readonly actionId: string
  readonly settingId: string
  readonly startDate: string
  readonly votingPower: string
  readonly snapshotBlock: string
  readonly yeas: string
  readonly nays: string
  readonly pausedAt: string
  readonly pauseDuration: string
  readonly quietEndingExtendedSeconds: string
  readonly quietEndingSnapshotSupport: string
  readonly script: string

  constructor(data: VoteData, connector: IDisputableVotingConnector) {
    this.#connector = connector

    this.id = data.id
    this.votingId = data.votingId
    this.voteId = data.voteId
    this.creator = data.creator
    this.context = data.context
    this.status = data.status
    this.actionId = data.actionId
    this.settingId = data.settingId
    this.startDate = data.startDate
    this.votingPower = data.votingPower
    this.snapshotBlock = data.snapshotBlock
    this.yeas = data.yeas
    this.nays = data.nays
    this.pausedAt = data.pausedAt
    this.pauseDuration = data.pauseDuration
    this.quietEndingExtendedSeconds = data.quietEndingExtendedSeconds
    this.quietEndingSnapshotSupport = data.quietEndingSnapshotSupport
    this.script = data.script
  }

  async castVotes({ first = 1000, skip = 0 } = {}): Promise<CastVote[]> {
    return this.#connector.castVotes(this.id, first, skip)
  }

  onCastVotes({ first = 1000, skip = 0 } = {}, callback: Function): SubscriptionHandler {
    return this.#connector.onCastVotes(this.id, first, skip, callback)
  }
}
