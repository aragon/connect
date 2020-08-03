import { SignatureData, IAgreementConnector } from '../types'

export default class Signature {
  #connector: IAgreementConnector

  readonly id: string
  readonly signerId: string
  readonly versionId: string
  readonly createdAt: string

  constructor(data: SignatureData, connector: IAgreementConnector) {
    this.#connector = connector

    this.id = data.id
    this.signerId = data.signerId
    this.versionId = data.versionId
    this.createdAt = data.createdAt
  }
}
