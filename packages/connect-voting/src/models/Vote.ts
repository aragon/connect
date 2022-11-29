import { SubscriptionCallback, SubscriptionResult } from '@aragon/connect-types'
import { subscription } from '@aragon/connect-core'
import { IVotingConnector, VoteData } from '../types'
import Cast from './Cast'

export enum EVotingStatus {
  Created = 'Created',
  // TODO: no difference between started and ongoing.
  Started = 'Started',
  Ongoing = 'Ongoing',
  // TODO: when would a voting status ever be ended, but not concluded?
  // seems never? it should either be accepted / rejected / executed.
  Ended = 'Ended',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Executed = 'Executed',
}

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
  }

  hasQuorumReached() {
    // Assuming heavily this won't overflow. We should really type our data so everyone
    // using / consuming the api knows what's what.
    const yea = parseInt(this.yea);
    const total = parseInt(this.votingPower);
    // What format will it be in? like 10 to indicate 10% or 0.10 to indicate 10%?
    // Assuming 0.10 = 10% for now.
    const requiredMin = parseFloat(this.minAcceptQuorum);
    const currentPositives = yea / total;
    return currentPositives > requiredMin;
  }

  hasStarted() {
    const startDate = parseInt(this.startDate) * 1000;
    return new Date().getTime() >= startDate;
  }

  hasExecuted() {
    return this.executed;
  }

  hasEnded() {
    // TODO: Need to add a new field for ending date, seems to be missing right now
    // and no way to determine when the vote ends for conclusion.
    return this.executed;
  }

  isCreated() {
    // If the object exists, its created.
    return true;
  }

  isOngoing() {
    return this.hasStarted() && (!this.hasEnded());
  }

  isAccepted() {
    // Assuming heavily this won't overflow. We should really type our data so everyone
    // using / consuming the api knows what's what.
    const positives = parseInt(this.yea);
    const total = parseInt(this.votingPower);

    const positivePercent = positives / total;
    const minSupport = parseFloat(this.supportRequiredPct);

    const acceptable = positivePercent > minSupport;
    return acceptable && this.hasQuorumReached();
  }

  isRejected() {
    return !this.isAccepted();
  }

  get status(): EVotingStatus {
    if (this.executed) {
      return EVotingStatus.Executed
    } else if (this.isAccepted()) {
      return EVotingStatus.Accepted;
    } else if (this.isRejected()) {
      return EVotingStatus.Rejected;
    } else if (this.hasStarted()) {
      return EVotingStatus.Started;
    } else {
      return EVotingStatus.Created;
    }
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
