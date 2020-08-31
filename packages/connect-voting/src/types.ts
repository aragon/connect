import {
  SubscriptionCallback,
  SubscriptionHandler,
} from '@aragon/connect-types'
import Vote from './models/Vote'
import Cast from './models/Cast'

export interface VoteData {
  id: string
  creator: string
  metadata: string
  executed: boolean
  startDate: string
  snapshotBlock: string
  supportRequiredPct: string
  minAcceptQuorum: string
  yea: string
  nay: string
  votingPower: string
  script: string
}

export interface CastData {
  id: string
  voteId: string
  voter: string
  supports: boolean
}

export interface IVotingConnector {
  disconnect(): Promise<void>
  votesForApp(appAddress: string, first: number, skip: number): Promise<Vote[]>
  onVotesForApp(
    appAddress: string,
    first: number,
    skip: number,
    callback: SubscriptionCallback<Vote[]>
  ): SubscriptionHandler
  castsForVote(voteId: string, first: number, skip: number): Promise<Cast[]>
  onCastsForVote(
    voteId: string,
    first: number,
    skip: number,
    callback: SubscriptionCallback<Cast[]>
  ): SubscriptionHandler
}
