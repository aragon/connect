import {
  Address,
  SubscriptionCallback,
  SubscriptionResult,
} from '@aragon/connect-types'
import { subscription } from '@aragon/connect-core'
import { IDisputableVotingConnector } from '../types'
import ERC20 from './ERC20'
import Vote from './Vote'
import Voter from './Voter'
import Setting from './Setting'

export default class DisputableVoting {
  #address: Address
  #connector: IDisputableVotingConnector

  constructor(connector: IDisputableVotingConnector, address: Address) {
    this.#connector = connector
    this.#address = address
  }

  async disconnect() {
    await this.#connector.disconnect()
  }

  async id(): Promise<string> {
    const data = await this.#connector.disputableVoting(this.#address)
    return data.id
  }

  async dao(): Promise<string> {
    const data = await this.#connector.disputableVoting(this.#address)
    return data.dao
  }

  async token(): Promise<ERC20> {
    const data = await this.#connector.disputableVoting(this.#address)
    return this.#connector.ERC20(data.token)
  }

  settingId(settingNumber: string): string {
    return `${this.#address}-setting-${settingNumber}`
  }

  async currentSetting(): Promise<Setting> {
    return this.#connector.currentSetting(this.#address)
  }

  onCurrentSetting(
    callback?: SubscriptionCallback<Setting>
  ): SubscriptionResult<Setting> {
    return subscription<Setting>(callback, (callback) =>
      this.#connector.onCurrentSetting(this.#address, callback)
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
    return this.#connector.settings(this.#address, first, skip)
  }

  onSettings(
    { first = 1000, skip = 0 } = {},
    callback?: SubscriptionCallback<Setting[]>
  ): SubscriptionResult<Setting[]> {
    return subscription<Setting[]>(callback, (callback) =>
      this.#connector.onSettings(this.#address, first, skip, callback)
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
    return this.#connector.votes(this.#address, first, skip)
  }

  onVotes(
    { first = 1000, skip = 0 } = {},
    callback?: SubscriptionCallback<Vote[]>
  ): SubscriptionResult<Vote[]> {
    return subscription<Vote[]>(callback, (callback) =>
      this.#connector.onVotes(this.#address, first, skip, callback)
    )
  }

  voterId(voterAddress: Address): string {
    return `${this.#address}-voterId-${voterAddress.toLowerCase()}`
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
}
