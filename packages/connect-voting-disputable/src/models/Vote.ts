import { SubscriptionHandler } from '@aragon/connect-types'

import Setting from './Setting'
import CastVote from './CastVote'
import DisputableVoting from './DisputableVoting'
import CollateralRequirement from './CollateralRequirement'
import { IDisputableVotingConnector, VoteData } from '../types'
import { toMilliseconds, bn, formatBn, PCT_BASE, PCT_DECIMALS } from '../helpers'

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
  readonly votingPower: string
  readonly snapshotBlock: string
  readonly yeas: string
  readonly nays: string
  readonly pausedAt: string
  readonly pauseDuration: string
  readonly quietEndingExtendedSeconds: string
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
    this.votingPower = data.votingPower
    this.snapshotBlock = data.snapshotBlock
    this.yeas = data.yeas
    this.nays = data.nays
    this.pausedAt = data.pausedAt
    this.pauseDuration = data.pauseDuration
    this.quietEndingExtendedSeconds = data.quietEndingExtendedSeconds
    this.quietEndingSnapshotSupport = data.quietEndingSnapshotSupport
    this.script = data.script
    this.executedAt = data.executedAt
    this.isAccepted = data.isAccepted
    this.tokenDecimals = data.tokenDecimals
  }

  get hasEnded(): boolean {
    return this.voteStatus !== 'Challenged' && this.voteStatus !== 'Disputed' &&
           Date.now() >= toMilliseconds(this.endDate)
  }

  get endDate(): string {
    const originalEndDate = bn(this.startDate).add(bn(this.duration))
    const endDateAfterPause = originalEndDate.add(bn(this.pauseDuration))
    return endDateAfterPause.add(bn(this.quietEndingExtendedSeconds)).toString()
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

  get formattedVotingPower(): string {
    return formatBn(this.votingPower, this.tokenDecimals)
  }

  get status(): string {
    if (this.hasEnded && this.voteStatus === 'Scheduled') {
      return this.isAccepted ? 'Accepted' : 'Rejected'
    }
    return this.voteStatus
  }

  castVoteId(voterAddress: string): string {
    return `${this.id}-cast-${voterAddress.toLowerCase()}`
  }

  async castVote(voterAddress: string): Promise<CastVote | null> {
    return this.#connector.castVote(this.castVoteId(voterAddress))
  }

  onCastVote(voterAddress: string, callback: Function): SubscriptionHandler {
    return this.#connector.onCastVote(this.castVoteId(voterAddress), callback)
  }

  async castVotes({ first = 1000, skip = 0 } = {}): Promise<CastVote[]> {
    return this.#connector.castVotes(this.id, first, skip)
  }

  onCastVotes({ first = 1000, skip = 0 } = {}, callback: Function): SubscriptionHandler {
    return this.#connector.onCastVotes(this.id, first, skip, callback)
  }

  async collateralRequirement(): Promise<CollateralRequirement> {
    return this.#connector.collateralRequirement(this.id)
  }

  onCollateralRequirement(callback: Function): SubscriptionHandler {
    return this.#connector.onCollateralRequirement(this.id, callback)
  }

  async setting(): Promise<Setting> {
    return this.#connector.setting(this.settingId)
  }

  onSetting(callback: Function): SubscriptionHandler {
    return this.#connector.onSetting(this.settingId, callback)
  }

  _disputableVoting(): DisputableVoting {
    return new DisputableVoting(this.#connector, this.votingId)
  }

  _votingPowerPct(num: string): string {
    const votingPower = bn(this.votingPower)
    return bn(num).mul(PCT_BASE).div(votingPower).toString()
  }
}
