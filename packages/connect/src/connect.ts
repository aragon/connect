import { ethers } from 'ethers'
import {
  Organization,
  ConnectorInterface,
  ConnectorJson,
  ConnectorJsonConfig,
} from '@aragon/connect-core'
import ConnectorEthereum, {
  ConnectorEthereumConfig,
} from '@aragon/connect-ethereum'
import ConnectorTheGraph, {
  ConnectorTheGraphConfig,
} from '@aragon/connect-thegraph'

type ConnectOptions = {
  readProvider?: ethers.providers.Provider
  chainId?: number
  ipfs?: ResolveIpfs
}
type ConnectorDeclaration =
  | ConnectorInterface
  | [string, object | undefined]
  | string

type ResolveIpfs = (ipfsIdentifier: string, path: string) => string

function normalizeConnectorConfig(
  connector: ConnectorDeclaration
): [string, object] | null {
  if (Array.isArray(connector)) {
    return [connector[0], connector[1] || {}]
  }
  if (typeof connector === 'string') {
    return [connector, {}]
  }
  return null
}

function getConnector(connector: ConnectorDeclaration): ConnectorInterface {
  const normalizedConfig = normalizeConnectorConfig(connector)

  if (normalizedConfig === null) {
    return connector as ConnectorInterface
  }

  const [name, config] = normalizedConfig

  if (name === 'json') {
    return new ConnectorJson(config as ConnectorJsonConfig)
  }
  if (name === 'thegraph') {
    return new ConnectorTheGraph(config as ConnectorTheGraphConfig)
  }
  if (name === 'ethereum') {
    return new ConnectorEthereum(config as ConnectorEthereumConfig)
  }

  throw new Error(`Unsupported connector name: ${name}`)
}

async function connect(
  location: string,
  connector: ConnectorDeclaration,
  { readProvider, chainId }: ConnectOptions = {}
): Promise<Organization> {
  return new Organization(
    location,
    getConnector(connector),
    readProvider,
    chainId
  )
}

export default connect
