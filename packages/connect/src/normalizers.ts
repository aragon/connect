import {
  JsonRpcProvider,
  getDefaultProvider,
  Web3Provider,
  Provider,
} from '@ethersproject/providers'
import type { Network } from '@1hive/connect-types'
import {
  ConnectorJson,
  ConnectorJsonConfig,
  ErrorInvalidConnector,
  ErrorInvalidEthereum,
  IOrganizationConnector,
  IpfsResolver,
  ipfsResolver,
} from '@1hive/connect-core'
import ConnectorEthereum, {
  ConnectorEthereumConfig,
} from '@1hive/connect-ethereum'
import ConnectorTheGraph, {
  ConnectorTheGraphConfig,
} from '@1hive/connect-thegraph'
import {
  ConnectorDeclaration,
  ConnectOptions,
  IpfsResolverDeclaration,
  IpfsResolverDeclarationObject,
} from './types'
import {
  DEFAULT_IPFS_CACHED_ITEMS,
  DEFAULT_IPFS_URL,
  MUMBAI_HTTP_ENDPOINT,
  POLYGON_HTTP_ENDPOINT,
  XDAI_HTTP_ENDPOINT,
} from './constants'

export function isIpfsResolver(
  ipfs?: IpfsResolverDeclaration
): ipfs is IpfsResolver {
  return (
    typeof (ipfs as IpfsResolver)?.url === 'function' &&
    typeof (ipfs as IpfsResolver)?.json === 'function'
  )
}

export function normalizeIpfsResolver(
  ipfs: ConnectOptions['ipfs']
): IpfsResolver {
  if (isIpfsResolver(ipfs)) {
    return ipfs
  }
  if (typeof ipfs === 'string') {
    return ipfsResolver(ipfs, DEFAULT_IPFS_CACHED_ITEMS)
  }
  return ipfsResolver(
    (ipfs as IpfsResolverDeclarationObject)?.urlTemplate ?? DEFAULT_IPFS_URL,
    (ipfs as IpfsResolverDeclarationObject)?.cache ?? DEFAULT_IPFS_CACHED_ITEMS
  )
}

export function normalizeConnectorConfig(
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

export function normalizeConnector(
  connector: ConnectorDeclaration,
  network: Network
): IOrganizationConnector {
  const normalizedConfig = normalizeConnectorConfig(connector)

  if (normalizedConfig === null) {
    return connector as IOrganizationConnector
  }

  const [name, config] = normalizedConfig

  if (!config.network) {
    config.network = network
  }

  if (name === 'json') {
    return new ConnectorJson(config as ConnectorJsonConfig)
  }

  if (name === 'thegraph') {
    return new ConnectorTheGraph(config as ConnectorTheGraphConfig)
  }

  if (name === 'ethereum') {
    return new ConnectorEthereum(config as ConnectorEthereumConfig)
  }

  throw new ErrorInvalidConnector(`Invalid connector: ${name}`)
}

export function normalizeEthersProvider(
  ethereumProvider: object | undefined,
  network: Network
): Provider {
  // Ethers compatibility: ethereum => homestead
  if (network.name === 'ethereum' && network.chainId === 1) {
    network = { ...network, name: 'homestead' }
  }

  if (ethereumProvider) {
    if (Provider.isProvider(ethereumProvider)) {
      return ethereumProvider
    }
    try {
      return new Web3Provider(ethereumProvider, network)
    } catch (err) {
      console.error('Invalid provider:', ethereumProvider, err)
      throw new ErrorInvalidEthereum(
        'The Ethereum provider doesn’t seem to be valid.'
      )
    }
  }

  if (network.chainId === 100) {
    return new JsonRpcProvider(XDAI_HTTP_ENDPOINT, network)
  }

  if (network.chainId === 137) {
    return new JsonRpcProvider(POLYGON_HTTP_ENDPOINT, network)
  }

  if (network.chainId === 80001) {
    return new JsonRpcProvider(MUMBAI_HTTP_ENDPOINT, network)
  }

  return getDefaultProvider(network)
}
