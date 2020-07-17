import { Network } from '@aragon/connect-types'
import { App } from '@aragon/connect-core'
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

async function connectVoting(
  app: App | Promise<App>,
  options: ConnectOptions = {}
): Promise<Voting> {
  app = await app

  if (!(app instanceof App)) {
    throw new Error(`connectVoting(): the passed value is not an App.`)
  }

  const network =
    options.network || app.organization.connection.orgConnector.network

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

export { Voting }
export { default as VotingConnectorTheGraph } from './connector'
export { default as Cast } from './entities/Cast'
export { default as Vote } from './entities/Vote'
export default connectVoting
