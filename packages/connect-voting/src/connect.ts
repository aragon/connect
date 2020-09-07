import {
  ErrorInvalidApp,
  ErrorInvalidConnector,
  ErrorInvalidNetwork,
  createAppConnector,
} from '@aragon/connect-core'
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
      throw new ErrorInvalidConnector(
        `Connector unsupported: ${connector}. Please use thegraph.`
      )
    }

    if (app.name !== 'voting') {
      throw new ErrorInvalidApp(
        `This app (${app.name}) is not compatible with @aragon/connect-voting. ` +
          `Please use an app instance of the voting.aragonpm.eth repo.`
      )
    }

    const subgraphUrl =
      config.subgraphUrl ?? subgraphUrlFromChainId(network.chainId) ?? undefined

    if (!subgraphUrl) {
      throw new ErrorInvalidNetwork(
        'No subgraph could be found for this network. ' +
          'Please provide a subgraphUrl or use one of the supported networks.'
      )
    }

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
