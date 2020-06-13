import { ethers } from 'ethers'
import {
  ConnectorInterface,
  ConnectorJson,
  ConnectorJsonConfig,
  Organization,
} from '@aragon/connect-core'
import ConnectorEthereum, {
  ConnectorEthereumConfig,
} from '@aragon/connect-ethereum'
import ConnectorTheGraph, {
  ConnectorTheGraphConfig,
} from '@aragon/connect-thegraph'
import { Networkish } from '@aragon/connect-types'

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

function getNetwork(chainId?: number): Networkish {
  if (chainId === 1 || !chainId) {
    return {
      chainId: 1,
      name: 'homestead',
      ensAddress: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    }
  }
  if (chainId === 4) {
    return {
      chainId: 4,
      name: 'rinkeby',
      ensAddress: '0x98df287b6c145399aaa709692c8d308357bc085d',
    }
  }
  return chainId
}

async function connect(
  location: string,
  connector: ConnectorDeclaration,
  { readProvider, chainId }: ConnectOptions = {}
): Promise<Organization> {
  const org = new Organization(
    location,
    getConnector(connector),
    readProvider,
    getNetwork(chainId)
  )

  await org._connect()

  return org
}

export default connect
