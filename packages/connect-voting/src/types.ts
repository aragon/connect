import { SubscriptionHandler } from '@aragon/connect-types'
import Vote from './entities/Vote'
import Cast from './entities/Cast'

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

export interface IVotingConnector {
  disconnect(): Promise<void>
  votesForApp(appAddress: string, first: number, skip: number): Promise<Vote[]>
  onVotesForApp(appAddress: string, callback: Function): SubscriptionHandler
  castsForVote(voteId: string, first: number, skip: number): Promise<Cast[]>
  onCastsForVote(voteId: string, callback: Function): SubscriptionHandler
}
