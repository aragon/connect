import { createAppConnector } from '@aragon/connect-core'
import DisputableVoting from './models/DisputableVoting'
import DisputableVotingConnectorTheGraph, {
  subgraphUrlFromChainId,
} from './thegraph/connector'

type Config = {
  pollInterval?: number
  subgraphUrl?: string
}

export default createAppConnector<DisputableVoting, Config>(
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

    const connectorTheGraph = new DisputableVotingConnectorTheGraph({
      pollInterval,
      subgraphUrl,
      verbose,
    })

    return new DisputableVoting(connectorTheGraph, app.address)
  }
)
