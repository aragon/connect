import { utils } from 'ethers'
import { subscription, App, ForwardingPath } from '@aragon/connect-core'
import { Address, SubscriptionCallback, SubscriptionResult } from '@aragon/connect-types'

import ERC20 from './ERC20'
import Vote from './Vote'
import Voter from './Voter'
import Setting from './Setting'
import CollateralRequirement from './CollateralRequirement'
import { IDisputableVotingConnector } from '../types'

export default class DisputableVoting {
  #app: App
  #connector: IDisputableVotingConnector

  readonly address: string

  constructor(connector: IDisputableVotingConnector, app: App) {
    this.#connector = connector
    this.#app = app

    this.address = app.address
  }

  async disconnect() {
    await this.#connector.disconnect()
  }

  async id(): Promise<string> {
    const data = await this.#connector.disputableVoting(this.address)
    return data.id
  }

  async dao(): Promise<string> {
    const data = await this.#connector.disputableVoting(this.address)
    return data.dao
  }

  async agreement(): Promise<string> {
    const data = await this.#connector.disputableVoting(this.address)
    return data.agreement
  }

  async token(): Promise<ERC20> {
    const data = await this.#connector.disputableVoting(this.address)
    return this.#connector.ERC20(data.token)
  }

  async currentSettingId(): Promise<string> {
    const data = await this.#connector.disputableVoting(this.address)
    return data.currentSettingId
  }

  async currentCollateralRequirementId(): Promise<string> {
    const data = await this.#connector.disputableVoting(this.address)
    return data.currentCollateralRequirementId
  }

  settingId(settingNumber: string): string {
    return `${this.address}-setting-${settingNumber}`
  }

  async currentSetting(): Promise<Setting> {
    return this.#connector.currentSetting(this.address)
  }

  onCurrentSetting(
    callback?: SubscriptionCallback<Setting>
  ): SubscriptionResult<Setting> {
    return subscription<Setting>(callback, (callback) =>
      this.#connector.onCurrentSetting(this.address, callback)
    )
  }

  async setting(settingNumber: string): Promise<Setting> {
    return this.#connector.setting(this.settingId(settingNumber))
  }

  onSetting(
    settingNumber: string,
    callback?: SubscriptionCallback<Setting>
  ): SubscriptionResult<Setting> {
    return subscription<Setting>(callback, (callback) =>
      this.#connector.onSetting(this.settingId(settingNumber), callback)
    )
  }

  async settings({ first = 1000, skip = 0 } = {}): Promise<Setting[]> {
    return this.#connector.settings(this.address, first, skip)
  }

  onSettings(
    { first = 1000, skip = 0 } = {},
    callback?: SubscriptionCallback<Setting[]>
  ): SubscriptionResult<Setting[]> {
    return subscription<Setting[]>(callback, (callback) =>
      this.#connector.onSettings(this.address, first, skip, callback)
    )
  }

  async currentCollateralRequirement(): Promise<CollateralRequirement> {
    return this.#connector.currentCollateralRequirement(this.address)
  }

  onCurrentCollateralRequirement(
    callback?: SubscriptionCallback<CollateralRequirement>
  ): SubscriptionResult<CollateralRequirement> {
    return subscription<CollateralRequirement>(callback, (callback) =>
      this.#connector.onCurrentCollateralRequirement(this.address, callback)
    )
  }

  async vote(voteId: string): Promise<Vote> {
    return this.#connector.vote(voteId)
  }

  onVote(
    voteId: string,
    callback?: SubscriptionCallback<Vote>
  ): SubscriptionResult<Vote> {
    return subscription<Vote>(callback, (callback) =>
      this.#connector.onVote(voteId, callback)
    )
  }

  async votes({ first = 1000, skip = 0 } = {}): Promise<Vote[]> {
    return this.#connector.votes(this.address, first, skip)
  }

  onVotes(
    { first = 1000, skip = 0 } = {},
    callback?: SubscriptionCallback<Vote[]>
  ): SubscriptionResult<Vote[]> {
    return subscription<Vote[]>(callback, (callback) =>
      this.#connector.onVotes(this.address, first, skip, callback)
    )
  }

  voterId(voterAddress: Address): string {
    return `${this.address}-voterId-${voterAddress.toLowerCase()}`
  }

  async voter(voterAddress: Address): Promise<Voter> {
    return this.#connector.voter(this.voterId(voterAddress))
  }

  onVoter(
    voterAddress: Address,
    callback?: SubscriptionCallback<Voter>
  ): SubscriptionResult<Voter> {
    return subscription<Voter>(callback, (callback) =>
      this.#connector.onVoter(this.voterId(voterAddress), callback)
    )
  }

  async newVote(script: string, context: string, signerAddress: string): Promise<ForwardingPath> {
    const intent = await this.#app.intent('newVote', [script, utils.toUtf8Bytes(context)], { actAs: signerAddress })

    // approve action collateral
    const agreement = await this.agreement()
    const { tokenId: collateralToken, actionAmount } = await this.currentCollateralRequirement()
    const preTransactions = await intent.buildApprovePreTransactions({ address: collateralToken, value: actionAmount, spender: agreement })

    intent.applyPreTransactions(preTransactions)
    return intent
  }

  async castVote(voteNumber: string, supports: boolean, signerAddress: string): Promise<ForwardingPath> {
    return this.#app.intent('vote', [voteNumber, supports], { actAs: signerAddress })
  }

  async executeVote(voteNumber: string, script: string, signerAddress: string): Promise<ForwardingPath> {
    return this.#app.intent('executeVote', [voteNumber, script], { actAs: signerAddress })
  }
}
