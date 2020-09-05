import {
  SubscriptionCallback,
  SubscriptionHandler,
} from '@aragon/connect-types'

import ERC20 from './models/ERC20'
import Vote from './models/Vote'
import Voter from './models/Voter'
import Setting from './models/Setting'
import CastVote from './models/CastVote'
import ArbitratorFee from './models/ArbitratorFee'
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
  quietEndingExtension: string
  context: string
  status: string
  actionId: string
  challengeId: string
  challenger: string
  challengeEndDate: string
  disputeId: string
  settingId: string
  startDate: string
  totalPower: string
  snapshotBlock: string
  yeas: string
  nays: string
  pausedAt: string
  pauseDuration: string
  quietEndingExtensionDuration: string
  quietEndingSnapshotSupport: string
  script: string
  settledAt: string
  disputedAt: string
  executedAt: string
  tokenDecimals: string
  isAccepted: boolean
  submitterArbitratorFeeId: string
  challengerArbitratorFeeId: string
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
  voteTime: string
  supportRequiredPct: string
  minimumAcceptanceQuorumPct: string
  delegatedVotingPeriod: string
  quietEndingPeriod: string
  quietEndingExtension: string
  executionDelay: string
  createdAt: string
}

export interface CollateralRequirementData {
  id: string
  voteId: string
  tokenId: string
  tokenDecimals: string
  actionAmount: string
  challengeAmount: string
  challengeDuration: string
}

export interface ArbitratorFeeData {
  id: string
  voteId: string
  tokenId: string
  tokenDecimals: string
  amount: string
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
  onDisputableVoting(
    disputableVoting: string,
    callback: SubscriptionCallback<DisputableVotingData>
  ): SubscriptionHandler
  currentSetting(disputableVoting: string): Promise<Setting>
  onCurrentSetting(
    disputableVoting: string,
    callback: SubscriptionCallback<Setting>
  ): SubscriptionHandler
  setting(settingId: string): Promise<Setting>
  onSetting(
    settingId: string,
    callback: SubscriptionCallback<Setting>
  ): SubscriptionHandler
  settings(
    disputableVoting: string,
    first: number,
    skip: number
  ): Promise<Setting[]>
  onSettings(
    disputableVoting: string,
    first: number,
    skip: number,
    callback: SubscriptionCallback<Setting[]>
  ): SubscriptionHandler
  vote(voteId: string): Promise<Vote>
  onVote(
    voteId: string,
    callback: SubscriptionCallback<Vote>
  ): SubscriptionHandler
  votes(disputableVoting: string, first: number, skip: number): Promise<Vote[]>
  onVotes(
    disputableVoting: string,
    first: number,
    skip: number,
    callback: SubscriptionCallback<Vote[]>
  ): SubscriptionHandler
  castVote(castVoteId: string): Promise<CastVote | null>
  onCastVote(
    castVoteId: string,
    callback: SubscriptionCallback<CastVote | null>
  ): SubscriptionHandler
  castVotes(voteId: string, first: number, skip: number): Promise<CastVote[]>
  onCastVotes(
    voteId: string,
    first: number,
    skip: number,
    callback: SubscriptionCallback<CastVote[]>
  ): SubscriptionHandler
  voter(voterId: string): Promise<Voter>
  onVoter(
    voterId: string,
    callback: SubscriptionCallback<Voter>
  ): SubscriptionHandler
  collateralRequirement(voteId: string): Promise<CollateralRequirement>
  onCollateralRequirement(
    voteId: string,
    callback: SubscriptionCallback<CollateralRequirement>
  ): SubscriptionHandler
  arbitratorFee(arbitratorFeeId: string): Promise<ArbitratorFee | null>
  onArbitratorFee(
    arbitratorFeeId: string,
    callback: SubscriptionCallback<ArbitratorFee | null>
  ): SubscriptionHandler
  ERC20(tokenAddress: string): Promise<ERC20>
  onERC20(tokenAddress: string, callback: Function): SubscriptionHandler
}
