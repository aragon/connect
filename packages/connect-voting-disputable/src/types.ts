import { SubscriptionHandler } from '@aragon/connect-types'

import ERC20 from './models/ERC20'
import Vote from './models/Vote'
import Voter from './models/Voter'
import Setting from './models/Setting'
import CastVote from './models/CastVote'
import CollateralRequirement from './models/CollateralRequirement'

export interface DisputableVotingData {
  id: string
  dao: string
  token: string
  currentSettingId: string
}

export interface VoteData {
  id: string
  votingId: string
  voteId: string
  creator: string
  duration: string
  context: string
  status: string
  actionId: string
  challengeId: string
  challenger: string
  challengeEndDate: string
  disputeId: string
  settingId: string
  startDate: string
  votingPower: string
  snapshotBlock: string
  yeas: string
  nays: string
  pausedAt: string
  pauseDuration: string
  quietEndingExtendedSeconds: string
  quietEndingSnapshotSupport: string
  script: string
  executedAt: string
  tokenDecimals: string
  isAccepted: boolean
}

export interface CastVoteData {
  id: string
  voteId: string
  voterId: string
  caster: string
  supports: boolean
  stake: string
  createdAt: string
}

export interface VoterData {
  id: string
  votingId: string
  address: string
  representative: string
}

export interface SettingData {
  id: string
  votingId: string
  settingId: string
  supportRequiredPct: string
  minimumAcceptanceQuorumPct: string
  executionDelay: string
  overruleWindow: string
  quietEndingPeriod: string
  quietEndingExtension: string
  createdAt: string
}

export interface CollateralRequirementData {
  id: string
  voteId: string
  tokenId: string
  actionAmount: string
  challengeAmount: string
  challengeDuration: string
}

export interface ERC20Data {
  id: string
  name: string
  symbol: string
  decimals: string
}

export interface IDisputableVotingConnector {
  disconnect(): Promise<void>
  disputableVoting(disputableVoting: string): Promise<DisputableVotingData>
  onDisputableVoting(disputableVoting: string, callback: Function): SubscriptionHandler
  currentSetting(disputableVoting: string): Promise<Setting>
  onCurrentSetting(disputableVoting: string, callback: Function): SubscriptionHandler
  setting(settingId: string): Promise<Setting>
  onSetting(settingId: string, callback: Function): SubscriptionHandler
  settings(disputableVoting: string, first: number, skip: number): Promise<Setting[]>
  onSettings(disputableVoting: string, first: number, skip: number, callback: Function): SubscriptionHandler
  vote(voteId: string): Promise<Vote>
  onVote(voteId: string, callback: Function): SubscriptionHandler
  votes(disputableVoting: string, first: number, skip: number): Promise<Vote[]>
  onVotes(disputableVoting: string, first: number, skip: number, callback: Function): SubscriptionHandler
  castVote(castVoteId: string): Promise<CastVote | null>
  onCastVote(castVoteId: string, callback: Function): SubscriptionHandler
  castVotes(voteId: string, first: number, skip: number): Promise<CastVote[]>
  onCastVotes(voteId: string, first: number, skip: number, callback: Function): SubscriptionHandler
  voter(voterId: string): Promise<Voter>
  onVoter(voterId: string, callback: Function): SubscriptionHandler
  collateralRequirement(voteId: string): Promise<CollateralRequirement>
  onCollateralRequirement(voteId: string, callback: Function): SubscriptionHandler
  ERC20(tokenAddress: string): Promise<ERC20>
  onERC20(tokenAddress: string, callback: Function): SubscriptionHandler
}
