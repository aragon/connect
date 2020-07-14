import { Network } from '@aragon/connect-types'
import { App, IOrganizationConnector } from '@aragon/connect-core'
import Voting from './entities/Voting'

function subgraphUrlFromChainId(chainId: number) {
  if (chainId === 1) {
    return 'https://api.thegraph.com/subgraphs/name/aragon/aragon-voting-mainnet'
  }
  if (chainId === 4) {
    return 'https://api.thegraph.com/subgraphs/name/aragon/aragon-voting-rinkeby'
  }
  return null
}

type ConnectOptions = {
  network?: Network
  subgraphUrl?: string
  verbose?: boolean
}

function connect(
  options: ConnectOptions = {}
): (app: App, orgConnector: IOrganizationConnector) => Voting {
  return function connect(
    app: App,
    orgConnector: IOrganizationConnector
  ): Voting {
    const { network } = orgConnector

    const subgraphUrl =
      options.subgraphUrl || subgraphUrlFromChainId(network.chainId)

    if (!subgraphUrl) {
      throw new Error(
        `[Voting] unsupported chainId: ${network.chainId}. ` +
          `Please set a supported chainId, or pass subgraphUrl directly.`
      )
    }

    return new Voting(app.address, subgraphUrl, options.verbose)
  }
}

export { Voting }
export { default as VotingConnectorTheGraph } from './connector'
export { default as Cast } from './entities/Cast'
export { default as Vote } from './entities/Vote'
export default connect
