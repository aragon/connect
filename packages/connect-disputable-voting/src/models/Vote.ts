import { subscription } from '@aragon/connect-core'
import { BigNumber, providers as ethersProviders } from 'ethers'
import { Address, SubscriptionCallback, SubscriptionResult } from '@aragon/connect-types'

import ERC20 from './ERC20'
import Setting from './Setting'
import CastVote from './CastVote'
import ArbitratorFee from './ArbitratorFee'
import CollateralRequirement from './CollateralRequirement'
import { IDisputableVotingConnector, VoteData } from '../types'
import {
  bn,
  formatBn,
  PCT_BASE,
  PCT_DECIMALS,
  currentTimestampEvm,
} from '../helpers'

export default class Vote {
  #ethersProvider: ethersProviders.Provider
  #connector: IDisputableVotingConnector

  readonly id: string
  readonly votingId: string
  readonly voteId: string
  readonly creator: string
  readonly duration: string
  readonly context: string
  readonly voteStatus: string
  readonly actionId: string
  readonly challengeId: string
  readonly challenger: string
  readonly challengeEndDate: string
  readonly disputeId: string
  readonly settingId: string
  readonly startDate: string
  readonly totalPower: string
  readonly snapshotBlock: string
  readonly yeas: string
  readonly nays: string
  readonly pausedAt: string
  readonly pauseDuration: string
  readonly quietEndingExtension: string
  readonly quietEndingExtensionDuration: string
  readonly quietEndingSnapshotSupport: string
  readonly script: string
  readonly settledAt: string
  readonly disputedAt: string
  readonly executedAt: string
  readonly isAccepted: boolean
  readonly tokenId: string
  readonly tokenDecimals: string
  readonly collateralRequirementId: string
  readonly submitterArbitratorFeeId: string
  readonly challengerArbitratorFeeId: string

  constructor(data: VoteData, connector: IDisputableVotingConnector, ethersProvider: ethersProviders.Provider) {
    this.#ethersProvider = ethersProvider
    this.#connector = connector

    this.id = data.id
    this.votingId = data.votingId
    this.voteId = data.voteId
    this.duration = data.duration
    this.quietEndingExtension = data.quietEndingExtension
    this.creator = data.creator
    this.context = data.context
    this.voteStatus = data.status
    this.actionId = data.actionId
    this.challengeId = data.challengeId
    this.challenger = data.challenger
    this.challengeEndDate = data.challengeEndDate
    this.disputeId = data.disputeId
    this.settingId = data.settingId
    this.startDate = data.startDate
    this.totalPower = data.totalPower
    this.snapshotBlock = data.snapshotBlock
    this.yeas = data.yeas
    this.nays = data.nays
    this.pausedAt = data.pausedAt
    this.pauseDuration = data.pauseDuration
    this.quietEndingExtensionDuration = data.quietEndingExtensionDuration
    this.quietEndingSnapshotSupport = data.quietEndingSnapshotSupport
    this.script = data.script
    this.settledAt = data.settledAt
    this.disputedAt = data.disputedAt
    this.executedAt = data.executedAt
    this.isAccepted = data.isAccepted
    this.tokenId = data.tokenId
    this.tokenDecimals = data.tokenDecimals
    this.collateralRequirementId = data.collateralRequirementId
    this.submitterArbitratorFeeId = data.submitterArbitratorFeeId
    this.challengerArbitratorFeeId = data.challengerArbitratorFeeId
  }

  get hasEnded(): boolean {
    const currentTimestamp = currentTimestampEvm()
    return this.voteStatus === 'Cancelled' || this.voteStatus === 'Settled' ||
      (this.voteStatus === 'Challenged' && currentTimestamp.gte(this.challengeEndDate)) ||
      (this.voteStatus !== 'Challenged' && this.voteStatus !== 'Disputed' && currentTimestamp.gte(this.endDate))
  }

  get endDate(): string {
    const baseVoteEndDate = bn(this.startDate).add(bn(this.duration))
    const endDateAfterPause = baseVoteEndDate.add(bn(this.pauseDuration))
    const lastComputedEndDate = endDateAfterPause.add(bn(this.quietEndingExtensionDuration))

    // The last computed end date is correct if we have not passed it yet or if no flip was detected in the last extension
    const currentTimestamp = currentTimestampEvm()
    if (currentTimestamp.lt(lastComputedEndDate) || !this.wasFlipped) {
      return lastComputedEndDate.toString()
    }

    // Otherwise, since the last computed end date was reached and included a flip, we need to extend the end date by one more period
    return lastComputedEndDate.add(bn(this.quietEndingExtension)).toString()
  }

  get currentQuietEndingExtensionDuration(): string {
    const actualEndDate = bn(this.endDate)
    const baseVoteEndDate = bn(this.startDate).add(bn(this.duration))
    const endDateAfterPause = baseVoteEndDate.add(bn(this.pauseDuration))

    // To know exactly how many extensions due to quiet ending we had, we subtract
    // the base vote and pause durations to the actual vote end date
    return actualEndDate.sub(endDateAfterPause).toString()
  }

  get yeasPct(): string {
    return this._votingPowerPct(this.yeas)
  }

  get naysPct(): string {
    return this._votingPowerPct(this.nays)
  }

  get formattedYeas(): string {
    return formatBn(this.yeas, this.tokenDecimals)
  }

  get formattedYeasPct(): string {
    return formatBn(this.yeasPct, PCT_DECIMALS)
  }

  get formattedNays(): string {
    return formatBn(this.nays, this.tokenDecimals)
  }

  get formattedNaysPct(): string {
    return formatBn(this.naysPct, PCT_DECIMALS)
  }

  get formattedTotalPower(): string {
    return formatBn(this.totalPower, this.tokenDecimals)
  }

  get status(): string {
    if (this.hasEnded) {
      if (this.voteStatus === 'Scheduled') {
        return this.isAccepted ? 'Accepted' : 'Rejected'
      } else if (this.voteStatus === 'Challenged') {
        return 'Settled'
      }
    }
    return this.voteStatus
  }

  get wasFlipped(): boolean {
    // If there was no snapshot taken, it means no one voted during the quiet ending period. Thus, it cannot have been flipped.
    if (this.quietEndingSnapshotSupport == 'Absent') {
      return false;
    }

    // Otherwise, we calculate if the vote was flipped by comparing its current acceptance state to its last state at the start of the extension period
    const wasInitiallyAccepted = this.quietEndingSnapshotSupport == 'Yea'
    const currentExtensions = bn(this.quietEndingExtensionDuration).div(bn(this.quietEndingExtension))
    const wasAcceptedBeforeLastFlip = wasInitiallyAccepted == (currentExtensions.mod(bn('2')).eq(bn('0')))
    return wasAcceptedBeforeLastFlip != this.isAccepted
  }

  async hasEndedExecutionDelay(): Promise<boolean> {
    const setting = await this.setting()
    const currentTimestamp = currentTimestampEvm()
    const executionDelayEndDate = bn(this.endDate).add(setting.executionDelay)
    return currentTimestamp.gte(executionDelayEndDate)
  }

  async canVote(voterAddress: Address): Promise<boolean> {
    return !this.hasEnded &&
      this.voteStatus === 'Scheduled' &&
      !(await this.hasVoted(voterAddress)) &&
      (await this.votingPower(voterAddress)).gt(bn(0))
  }

  async canExecute(): Promise<boolean> {
    return this.isAccepted &&
      this.voteStatus === 'Scheduled' &&
      (await this.hasEndedExecutionDelay())
  }

  async votingPower(voterAddress: Address): Promise<BigNumber> {
    const token = await this.token()
    return token.balanceAt(voterAddress, this.snapshotBlock)
  }

  async formattedVotingPower(voterAddress: Address): Promise<string> {
    const token = await this.token()
    const balance = await token.balanceAt(voterAddress, this.snapshotBlock)
    return formatBn(balance, token.decimals)
  }

  async token(): Promise<ERC20> {
    return this.#connector.ERC20(this.tokenId)
  }

  async hasVoted(voterAddress: Address): Promise<boolean> {
    const castVote = await this.castVote(voterAddress)
    return castVote !== null
  }

  castVoteId(voterAddress: Address): string {
    return `${this.id}-cast-${voterAddress.toLowerCase()}`
  }

  async castVote(voterAddress: Address): Promise<CastVote | null> {
    return this.#connector.castVote(this.castVoteId(voterAddress))
  }

  onCastVote(
    voterAddress: Address,
    callback?: SubscriptionCallback<CastVote | null>
  ): SubscriptionResult<CastVote | null> {
    return subscription<CastVote | null>(callback, (callback) =>
      this.#connector.onCastVote(this.castVoteId(voterAddress), callback)
    )
  }

  async castVotes({ first = 1000, skip = 0 } = {}): Promise<CastVote[]> {
    return this.#connector.castVotes(this.id, first, skip)
  }

  onCastVotes(
    { first = 1000, skip = 0 } = {},
    callback?: SubscriptionCallback<CastVote[]>
  ): SubscriptionResult<CastVote[]> {
    return subscription<CastVote[]>(callback, (callback) =>
      this.#connector.onCastVotes(this.id, first, skip, callback)
    )
  }

  async collateralRequirement(): Promise<CollateralRequirement> {
    return this.#connector.collateralRequirement(this.collateralRequirementId)
  }

  onCollateralRequirement(
    callback?: SubscriptionCallback<CollateralRequirement>
  ): SubscriptionResult<CollateralRequirement> {
    return subscription<CollateralRequirement>(callback, (callback) =>
      this.#connector.onCollateralRequirement(this.collateralRequirementId, callback)
    )
  }

  async submitterArbitratorFee(): Promise<ArbitratorFee | null> {
    return this.#connector.arbitratorFee(this.submitterArbitratorFeeId || '')
  }

  onSubmitterArbitratorFee(
    callback?: SubscriptionCallback<ArbitratorFee | null>
  ): SubscriptionResult<ArbitratorFee | null> {
    return subscription<ArbitratorFee | null>(callback, (callback) =>
      this.#connector.onArbitratorFee(this.submitterArbitratorFeeId || '', callback)
    )
  }

  async challengerArbitratorFee(): Promise<ArbitratorFee | null> {
    return this.#connector.arbitratorFee(this.challengerArbitratorFeeId || '')
  }

  onChallengerArbitratorFee(
    callback?: SubscriptionCallback<ArbitratorFee | null>
  ): SubscriptionResult<ArbitratorFee | null> {
    return subscription<ArbitratorFee | null>(callback, (callback) =>
      this.#connector.onArbitratorFee(this.challengerArbitratorFeeId || '', callback)
    )
  }

  async setting(): Promise<Setting> {
    return this.#connector.setting(this.settingId)
  }

  onSetting(
    callback?: SubscriptionCallback<Setting>
  ): SubscriptionResult<Setting> {
    return subscription<Setting>(callback, (callback) =>
      this.#connector.onSetting(this.settingId, callback)
    )
  }

  _votingPowerPct(num: string): string {
    const totalPower = bn(this.totalPower)
    return bn(num).mul(PCT_BASE).div(totalPower).toString()
  }
}
