import { createAppConnector } from '@aragon/connect-core'
import Voting from './entities/Voting'
import VotingConnectorTheGraph, {
  subgraphUrlFromChainId,
} from './thegraph/connector'

type Config = {
  subgraphUrl: string
}

export default createAppConnector<Voting, Config>(
  ({ app, config, connector, network, verbose }) => {
    if (connector !== 'thegraph') {
      console.warn(
        `Connector unsupported: ${connector}. Using thegraph instead.`
      )
    }

    return new Voting(
      new VotingConnectorTheGraph(
        config.subgraphUrl ?? subgraphUrlFromChainId(network.chainId),
        verbose
      ),
      app.address
    )
  }
)
