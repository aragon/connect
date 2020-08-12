import { createAppConnector } from '@aragon/connect-core'

import Agreement from './models/Agreement'
import AgreementConnectorTheGraph, {
  subgraphUrlFromChainId,
} from './thegraph/connector'

type Config = {
  subgraphUrl: string
}

export default createAppConnector<Agreement, Config>(
  ({ app, config, connector, network, verbose }) => {
    if (connector !== 'thegraph') {
      console.warn(
        `Connector unsupported: ${connector}. Using "thegraph" instead.`
      )
    }

    const subgraphUrl =
      config.subgraphUrl ?? subgraphUrlFromChainId(network.chainId)
    const agreementConnector = new AgreementConnectorTheGraph(
      subgraphUrl,
      verbose
    )
    return new Agreement(agreementConnector, app.address)
  }
)
