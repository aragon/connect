import { Address, SubscriptionHandler } from '@aragon/connect-types'
import { IAppConnected } from '@aragon/connect-core'
import Vote from './Vote'
import { IVotingConnector } from '../types'

export default class Voting implements IAppConnected {
  #connector: IVotingConnector
  #appAddress: Address

  constructor(connector: IVotingConnector, appAddress: Address) {
    this.#connector = connector
    this.#appAddress = appAddress
  }

  async votes({ first = 1000, skip = 0 } = {}): Promise<Vote[]> {
    return this.#connector.votesForApp(this.#appAddress, first, skip)
  }

  onVotes(callback: Function): SubscriptionHandler {
    return this.#connector.onVotesForApp!(this.#appAddress, callback)
  }
}
