import {
  SubscriptionCallback,
  SubscriptionHandler,
} from '@aragon/connect-types'

import Signature from '../models/Signature'
import { SignerData, IAgreementConnector } from '../types'

export default class Signer {
  #connector: IAgreementConnector

  readonly id: string
  readonly address: string
  readonly agreementId: string

  constructor(data: SignerData, connector: IAgreementConnector) {
    this.#connector = connector

    this.id = data.id
    this.address = data.address
    this.agreementId = data.agreementId
  }

  async disconnect() {
    await this.#connector.disconnect()
  }

  async hasSigned(versionNumber: string): Promise<boolean> {
    const versionId = `${this.agreementId}-version-${versionNumber}`
    const signatures = await this.signatures()
    return signatures.some(
      (signature: Signature) => signature.versionId === versionId
    )
  }

  async signatures({ first = 1000, skip = 0 } = {}): Promise<Signature[]> {
    return this.#connector.signatures(this.id, first, skip)
  }

  onSignatures(
    { first = 1000, skip = 0 } = {},
    callback: SubscriptionCallback<Signature[]>
  ): SubscriptionHandler {
    return this.#connector.onSignatures(this.id, first, skip, callback)
  }
}
