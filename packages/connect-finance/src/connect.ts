import { createAppConnector, Network } from '@aragon/connect-core'
import { IFinanceConnector } from './types'
import Finance from './entities/Finance'
import FinanceConnectorTheGraph, {
  subgraphUrlFromChainId,
} from './thegraph/connector'

type Config = {
  subgraphUrl: string
}

export default createAppConnector<Finance, Config>(
  async ({ app, config, connector, network, verbose }) => {
    if (connector !== 'thegraph') {
      console.warn(
        `Connector unsupported: ${connector}. Using "thegraph" instead.`
      )
    }

    return new Finance(
      new FinanceConnectorTheGraph(
        config.subgraphUrl ?? subgraphUrlFromChainId(network.chainId),
        verbose
      ),
      app.address
    )
  }
)
