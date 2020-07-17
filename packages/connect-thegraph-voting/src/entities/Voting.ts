import { SubscriptionHandler } from '@aragon/connect-types'
import { IAppConnected } from '@aragon/connect-core'
import Vote from './Vote'
import VotingConnectorTheGraph from '../connector'

export default class Voting implements IAppConnected {
  #connector: VotingConnectorTheGraph
  readonly appAddress: string

  constructor(appAddress: string, subgraphUrl: string, verbose = false) {
    this.#connector = new VotingConnectorTheGraph(subgraphUrl, verbose)
    this.appAddress = appAddress
  }

  async votes({ first = 1000, skip = 0 } = {}): Promise<Vote[]> {
    return this.#connector.votesForApp(this.appAddress, first, skip)
  }

  onVotes(callback: Function): SubscriptionHandler {
    return this.#connector.onVotesForApp!(this.appAddress, callback)
  }
}
