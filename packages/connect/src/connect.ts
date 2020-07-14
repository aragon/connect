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
import { Network } from '@aragon/connect-types'

export type ConnectOptionsResolveIpfs = (
  ipfsIdentifier: string,
  path: string
) => string

export type ConnectOptions = {
  readProvider?: ethers.providers.Provider
  chainId?: number
  ipfs?: ConnectOptionsResolveIpfs
}

export type ConnectorDeclaration =
  | ConnectorInterface
  | [string, object | undefined]
  | string

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

function getConnector(
  connector: ConnectorDeclaration,
  network: Network
): ConnectorInterface {
  const normalizedConfig = normalizeConnectorConfig(connector)

  if (normalizedConfig === null) {
    return connector as ConnectorInterface
  }

  const [name, config] = normalizedConfig

  if (name === 'json') {
    return new ConnectorJson(config as ConnectorJsonConfig)
  }
  if (name === 'thegraph') {
    return new ConnectorTheGraph(network, config as ConnectorTheGraphConfig)
  }
  if (name === 'ethereum') {
    return new ConnectorEthereum(config as ConnectorEthereumConfig)
  }

  throw new Error(`Unsupported connector name: ${name}`)
}

function getNetwork(chainId?: number): Network | null {
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
  if (chainId === 100) {
    return {
      chainId: 100,
      name: 'xdai',
      ensAddress: '0xaafca6b0c89521752e559650206d7c925fd0e530',
    }
  }
  return null
}

async function connect(
  location: string,
  connector: ConnectorDeclaration,
  { readProvider, chainId }: ConnectOptions = {}
): Promise<Organization> {
  const network = getNetwork(chainId)
  if (!network) {
    throw new Error(`Invalid chainId provided: ${chainId}`)
  }

  const _connector = getConnector(connector, network)
  await _connector.connect?.()

  const org = new Organization(location, _connector, readProvider, network)
  await org._connect()

  return org
}

export default connect
