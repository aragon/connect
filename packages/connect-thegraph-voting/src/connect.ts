import { Network, Networkish } from '@aragon/connect-types'
import { App, ConnectionContext, toNetwork } from '@aragon/connect-core'
import { IVotingConnector } from './types'
import Voting from './entities/Voting'
import VotingConnectorTheGraph, {
  subgraphUrlFromChainId,
} from './thegraph/connector'

type ConnectorDeclaration = string | [string, object | undefined]

type ConnectOptions = {
  connector?: ConnectorDeclaration
  network?: Networkish
}

function normalizeConnectorConfig(
  connector: ConnectorDeclaration
): [string, any] | null {
  if (Array.isArray(connector)) {
    return [connector[0], connector[1] || {}]
  }
  if (typeof connector === 'string') {
    return [connector, {}]
  }
  return null
}

function getConnector(
  connection: ConnectionContext,
  network: Network,
  connector?: ConnectorDeclaration
): IVotingConnector {
  const normalizedConfig = connector
    ? normalizeConnectorConfig(connector)
    : null

  const name = normalizedConfig?.[0] || connection.orgConnector.name
  const config = normalizedConfig?.[1] || {}

  if (name === 'thegraph') {
    return new VotingConnectorTheGraph(
      config.subgraphUrl ?? subgraphUrlFromChainId(network.chainId),
      config.verbose ?? connection.verbose
    )
  }

  throw new Error(`Unsupported connector name: ${name}`)
}

async function connect(
  app: App | Promise<App>,
  options: ConnectOptions = {}
): Promise<Voting> {
  app = await app

  if (!(app instanceof App)) {
    throw new Error(`connectVoting(): the passed value is not an App.`)
  }

  const { connection } = app.organization
  const network = toNetwork(options.network || connection.orgConnector.network)
  const connector = getConnector(connection, network, options.connector)

  return new Voting(connector, app.address)
}

export default connect
