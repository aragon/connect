import {
  Address,
  SubscriptionCallback,
  SubscriptionResult,
} from '@aragon/connect-types'
import { subscription } from '@aragon/connect-core'
import { IDisputableVotingConnector, VoteData } from '../types'
import Setting from './Setting'
import CastVote from './CastVote'
import DisputableVoting from './DisputableVoting'
import CollateralRequirement from './CollateralRequirement'
import {
  toMilliseconds,
  bn,
  formatBn,
  PCT_BASE,
  PCT_DECIMALS,
} from '../helpers'

export default class Vote {
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
  readonly quietEndingExtensionDuration: string
  readonly quietEndingSnapshotSupport: string
  readonly script: string
  readonly executedAt: string
  readonly isAccepted: boolean
  readonly tokenDecimals: string

  constructor(data: VoteData, connector: IDisputableVotingConnector) {
    this.#connector = connector

    this.id = data.id
    this.votingId = data.votingId
    this.voteId = data.voteId
    this.duration = data.duration
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
    this.executedAt = data.executedAt
    this.isAccepted = data.isAccepted
    this.tokenDecimals = data.tokenDecimals
  }

  get hasEnded(): boolean {
    return this.voteStatus === 'Cancelled' || this.voteStatus === 'Settled' || (
      this.voteStatus !== 'Challenged' &&
      this.voteStatus !== 'Disputed' &&
      Date.now() >= toMilliseconds(this.endDate)
    )
  }

  get endDate(): string {
    const originalEndDate = bn(this.startDate).add(bn(this.duration))
    const endDateAfterPause = originalEndDate.add(bn(this.pauseDuration))
    return endDateAfterPause.add(bn(this.quietEndingExtensionDuration)).toString()
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
    if (this.hasEnded && this.voteStatus === 'Scheduled') {
      return this.isAccepted ? 'Accepted' : 'Rejected'
    }
    return this.voteStatus
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
    return this.#connector.collateralRequirement(this.id)
  }

  onCollateralRequirement(
    callback?: SubscriptionCallback<CollateralRequirement>
  ): SubscriptionResult<CollateralRequirement> {
    return subscription<CollateralRequirement>(callback, (callback) =>
      this.#connector.onCollateralRequirement(this.id, callback)
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

  _disputableVoting(): DisputableVoting {
    return new DisputableVoting(this.#connector, this.votingId)
  }

  _votingPowerPct(num: string): string {
    const totalPower = bn(this.totalPower)
    return bn(num).mul(PCT_BASE).div(totalPower).toString()
  }
}
