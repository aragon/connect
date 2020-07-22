import { Address, SubscriptionHandler } from '@aragon/connect-types'
import Vote from './Vote'
import { IVotingConnector } from '../types'

export default class Voting {
  #appAddress: Address
  #connector: IVotingConnector

  constructor(connector: IVotingConnector, appAddress: Address) {
    this.#appAddress = appAddress
    this.#connector = connector
  }

  async disconnect() {
    await this.#connector.disconnect()
  }

  async votes({ first = 1000, skip = 0 } = {}): Promise<Vote[]> {
    return this.#connector.votesForApp(this.#appAddress, first, skip)
  }

  onVotes(callback: Function): SubscriptionHandler {
    return this.#connector.onVotesForApp!(this.#appAddress, callback)
  }
}
