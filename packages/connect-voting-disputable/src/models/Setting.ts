import { SettingData, IDisputableVotingConnector } from '../types'

export default class Setting {
  #connector: IDisputableVotingConnector

  readonly id: string
  readonly votingId: string
  readonly settingId: string
  readonly supportRequiredPct: string
  readonly minimumAcceptanceQuorumPct: string
  readonly executionDelay: string
  readonly overruleWindow: string
  readonly quietEndingPeriod: string
  readonly quietEndingExtension: string
  readonly createdAt: string

  constructor(data: SettingData, connector: IDisputableVotingConnector) {
    this.#connector = connector

    this.id = data.id
    this.votingId = data.votingId
    this.settingId = data.settingId
    this.supportRequiredPct = data.supportRequiredPct
    this.minimumAcceptanceQuorumPct = data.minimumAcceptanceQuorumPct
    this.executionDelay = data.executionDelay
    this.overruleWindow = data.overruleWindow
    this.quietEndingPeriod = data.quietEndingPeriod
    this.quietEndingExtension = data.quietEndingExtension
    this.createdAt = data.createdAt
  }
}
