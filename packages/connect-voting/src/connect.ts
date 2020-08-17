import { createAppConnector } from '@aragon/connect-core'
import Voting from './models/Voting'
import VotingConnectorTheGraph, {
  subgraphUrlFromChainId,
} from './thegraph/connector'

type Config = {
  pollInterval?: number
  subgraphUrl?: string
}

export default createAppConnector<Voting, Config>(
  ({ app, config, connector, network, orgConnector, verbose }) => {
    if (connector !== 'thegraph') {
      console.warn(
        `Connector unsupported: ${connector}. Using "thegraph" instead.`
      )
    }

    const subgraphUrl =
      config.subgraphUrl ?? subgraphUrlFromChainId(network.chainId) ?? undefined

    let pollInterval
    if (orgConnector.name === 'thegraph') {
      pollInterval =
        config?.pollInterval ?? orgConnector.config?.pollInterval ?? undefined
    }

    const connectorTheGraph = new VotingConnectorTheGraph({
      pollInterval,
      subgraphUrl,
      verbose,
    })

    return new Voting(connectorTheGraph, app.address)
  }
)
