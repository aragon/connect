import VotingEntity from './Entity'
import Vote from './Vote'
import VotingConnectorTheGraph from '../connector'
import { App } from '@aragon/connect'

export default class Voting extends VotingEntity {
  readonly appAddress: string

  constructor(appAddress: string, subgraphUrl: string) {
    super(new VotingConnectorTheGraph(subgraphUrl))

    this.appAddress = appAddress
  }

  async votes(): Promise<Vote[]> {
    return this._connector.votesForApp(this.appAddress)
  }
}
