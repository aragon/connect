import VotingEntity from './Entity'
import Vote from './Vote'
import VotingConnectorTheGraph from '../connector'

export default class Voting extends VotingEntity {
  readonly appAddress: string

  constructor(appAddress: string, subgraphUrl: string) {
    super(new VotingConnectorTheGraph(subgraphUrl))

    this.appAddress = appAddress
  }

  async votes(first = 1000, skip = 0): Promise<Vote[]> {
    return this._connector.votesForApp(
      this.appAddress,
      first,
      skip
    )
  }
}
