import {
  createAppConnector,
  ErrorInvalid,
  ErrorUnsupported,
} from '@aragon/connect-core'
import Tokens from './models/Tokens'
import TokensConnectorTheGraph, {
  subgraphUrlFromChainId,
} from './thegraph/connector'

type Config = {
  pollInterval?: number
  subgraphUrl?: string
}

export default createAppConnector<Tokens, Config>(
  async ({ app, config, connector, network, orgConnector, verbose }) => {
    if (connector !== 'thegraph') {
      throw new ErrorUnsupported(
        `Connector unsupported: ${connector}. Please use thegraph.`
      )
    }

    if (app.name !== 'token-manager') {
      throw new ErrorInvalid(
        `This app (${app.name}) is not compatible with @aragon/connect-tokens. ` +
          `Please use an app instance of the token-manager.aragonpm.eth repo.`
      )
    }

    const subgraphUrl =
      config.subgraphUrl ?? subgraphUrlFromChainId(network.chainId) ?? undefined

    let pollInterval
    if (orgConnector.name === 'thegraph') {
      pollInterval =
        config?.pollInterval ?? orgConnector.config?.pollInterval ?? undefined
    }

    const connectorTheGraph = await TokensConnectorTheGraph.create({
      appAddress: app.address,
      pollInterval,
      subgraphUrl,
      verbose,
    })

    return Tokens.create(connectorTheGraph)
  }
)
