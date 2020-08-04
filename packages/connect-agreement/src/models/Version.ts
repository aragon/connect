import { VersionData, IAgreementConnector } from '../types'

export default class Version {
  #connector: IAgreementConnector

  readonly id: string
  readonly versionId: string
  readonly content: string
  readonly title: string
  readonly arbitrator: string
  readonly appFeesCashier: string
  readonly effectiveFrom: string

  constructor(data: VersionData, connector: IAgreementConnector) {
    this.#connector = connector

    this.id = data.id
    this.versionId = data.versionId
    this.content = data.content
    this.title = data.title
    this.arbitrator = data.arbitrator
    this.appFeesCashier = data.appFeesCashier
    this.effectiveFrom = data.effectiveFrom
  }
}
