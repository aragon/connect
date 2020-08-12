import { BigNumber } from 'ethers'
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
  }

  get hasEnded(): boolean {
    const now = new Date().getTime()
    return now >= toMilliseconds(this.endDate)
  }

  get endDate(): string {
    const originalEndDate = bn(this.startDate).add(bn(this.duration))
    const endDateAfterPause = originalEndDate.add(bn(this.pauseDuration))
    return endDateAfterPause.add(bn(this.quietEndingExtendedSeconds)).toString()
  }

  get yeasPct(): string {
    return this.votingPowerPct(this.yeas)
  }

  get naysPct(): string {
    return this.votingPowerPct(this.nays)
  }

  votingPowerPct(num: string): string {
    const votingPower = bn(this.votingPower)
    return bn(num).mul(PCT_BASE).div(votingPower).toString()
  }

  async formattedYeas(): Promise<string> {
    return formatBn(this.yeas, await this._tokenDecimals())
  }

  async formattedYeasPct(): Promise<string> {
    return formatBn(this.yeasPct, PCT_DECIMALS)
  }

  async formattedNays(): Promise<string> {
    return formatBn(this.nays, await this._tokenDecimals())
  }

  async formattedNaysPct(): Promise<string> {
    return formatBn(this.naysPct, PCT_DECIMALS)
  }

  async status(): Promise<string> {
    if (this.hasEnded && this.voteStatus === 'Scheduled') {
      const wasAccepted = await this.isAccepted()
      return wasAccepted ? 'Accepted' : 'Rejected'
    }
    return this.voteStatus
  }

  async isAccepted(): Promise<boolean> {
    const yeas = bn(this.yeas)
    const nays = bn(this.nays)
    const setting = await this.setting()

    return this._isValuePct(yeas, yeas.add(nays), bn(setting.supportRequiredPct)) &&
           this._isValuePct(yeas, bn(this.votingPower), bn(setting.minimumAcceptanceQuorumPct))
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

  async _tokenDecimals(): Promise<string> {
    const erc20 = await this._disputableVoting().token()
    return erc20.decimals
  }

  _isValuePct(value: BigNumber, total: BigNumber, pct: BigNumber): boolean {
    return !total.eq(bn('0')) && (value.mul(PCT_BASE).div(total)).gt(pct)
  }
}
