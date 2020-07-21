import { createAppConnector, Network } from '@aragon/connect-core'
import { ITokensConnector } from './types'
import Tokens from './entities/Tokens'
import TokensConnectorTheGraph, {
  subgraphUrlFromChainId,
} from './thegraph/connector'

type Config = {
  subgraphUrl?: string
}

export default createAppConnector<Tokens, Config>(
  async ({ app, config, connector, network, verbose }) => {
    if (connector !== 'thegraph') {
      console.warn(
        `Connector unsupported: ${connector}. Using "thegraph" instead.`
      )
    }

    const tokensConnector = await TokensConnectorTheGraph.create(
      config.subgraphUrl ?? (subgraphUrlFromChainId(network.chainId) || ''),
      app.address,
      verbose
    )

    return new Tokens(tokensConnector, app.address)
  }
)
