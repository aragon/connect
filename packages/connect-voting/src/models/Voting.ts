import {
  Address,
  SubscriptionCallback,
  SubscriptionResult,
} from '@aragon/connect-types'
import { subscription } from '@aragon/connect-core'
import { IVotingConnector } from '../types'
import Vote from './Vote'

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

  onVotes(
    { first = 1000, skip = 0 } = {},
    callback?: SubscriptionCallback<Vote[]>
  ): SubscriptionResult<Vote[]> {
    return subscription<Vote[]>(callback, (callback) =>
      this.#connector.onVotesForApp(this.#appAddress, first, skip, callback)
    )
  }
}
