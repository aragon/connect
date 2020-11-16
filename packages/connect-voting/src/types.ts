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
  executedAt: string
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
  vote: string
  voter: VoterData
  supports: boolean
  stake: string
  createAt: string
}

export interface VoterData {
  id: string
  address: string
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
  castsForVote(vote: string, first: number, skip: number): Promise<Cast[]>
  onCastsForVote(
    vote: string,
    first: number,
    skip: number,
    callback: SubscriptionCallback<Cast[]>
  ): SubscriptionHandler
}
