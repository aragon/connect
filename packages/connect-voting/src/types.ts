import {
  SubscriptionCallback,
  SubscriptionHandler,
} from '@aragon/connect-types'
import Vote from './models/Vote'
import Cast from './models/Cast'
import Reward from './models/Reward'
import Call from './models/Call'

export interface VoteData {
  id: string
  creator: string
  originalCreator: string
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
  spec: string
}

export interface RewardData {
  id: string
  vote: VoteData
  token: string
  to: string
  amount: string
}

export interface CallData {
  id: string
  vote: VoteData
  contract: string
  calldata: string
}

export interface CastData {
  id: string
  vote: string
  voter: VoterData
  supports: boolean
  stake: string
  createdAt: string
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
  rewardsForVote(vote: string, first: number, skip: number): Promise<Reward[]>
  onRewardsForVote(
    vote: string,
    first: number,
    skip: number,
    callback: SubscriptionCallback<Reward[]>
  ): SubscriptionHandler
  callsForVote(vote: string, first: number, skip: number): Promise<Call[]>
  onCallsForVote(
    vote: string,
    first: number,
    skip: number,
    callback: SubscriptionCallback<Call[]>
  ): SubscriptionHandler
}
