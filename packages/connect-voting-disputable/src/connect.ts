import { createAppConnector } from '@aragon/connect-core'

import DisputableVoting from './models/DisputableVoting'
import DisputableVotingConnectorTheGraph, {
  subgraphUrlFromChainId,
} from './thegraph/connector'

type Config = {
  subgraphUrl: string
}

export default createAppConnector<DisputableVoting, Config>(
  ({ app, config, connector, network, verbose }) => {
    if (connector !== 'thegraph') {
      console.warn(
        `Connector unsupported: ${connector}. Using "thegraph" instead.`
      )
    }

    const subgraphUrl =
      config.subgraphUrl ?? subgraphUrlFromChainId(network.chainId)
    const votingConnector = new DisputableVotingConnectorTheGraph(
      subgraphUrl,
      verbose
    )
    return new DisputableVoting(votingConnector, app.address)
  }
)
