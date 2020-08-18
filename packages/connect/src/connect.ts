import {
  getDefaultProvider as getDefaultEthersProvider,
  providers as ethersProviders,
  utils as ethersUtils,
} from 'ethers'
import {
  ConnectorJson,
  ConnectorJsonConfig,
  IOrganizationConnector,
  Organization,
  toNetwork,
} from '@aragon/connect-core'
import ConnectorEthereum, {
  ConnectorEthereumConfig,
} from '@aragon/connect-ethereum'
import ConnectorTheGraph, {
  ConnectorTheGraphConfig,
} from '@aragon/connect-thegraph'
import { Address, Network, Networkish } from '@aragon/connect-types'
import { XDAI_WSS_ENDPOINT, DEFAULT_IPFS_URL } from './constants'

export type IpfsUrlResolver = (cid: string, path?: string) => string

export type ConnectOptions = {
  actAs?: string
  ethereum?: object
  ipfs?: IpfsUrlResolver | string
  network?: Networkish
  verbose?: boolean
}

export type ConnectorDeclaration =
  | IOrganizationConnector
  | ['ethereum', ConnectorEthereumConfig | undefined]
  | ['json', ConnectorJsonConfig | undefined]
  | ['thegraph', ConnectorTheGraphConfig | undefined]
  | [string, any]
  | string

type IpfsResolver = (cid: string, path?: string) => string

function ipfsResolverFromUrlTemplate(urlTemplate: string): IpfsResolver {
  return function ipfsResolver(cid: string, path?): string {
    const url = urlTemplate.replace(/\{cid\}/, cid)
    if (!path) {
      return url.replace(/\{path\}/, '')
    }
    if (!path.startsWith('/')) {
      path = `/${path}`
    }
    return url.replace(/\{path\}/, path)
  }
}

function getIpfsResolver(ipfs: ConnectOptions['ipfs']) {
  if (typeof ipfs === 'function') {
    return ipfs
  }
  return ipfsResolverFromUrlTemplate(ipfs || DEFAULT_IPFS_URL)
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

  throw new Error(`Unsupported connector name: ${name}`)
}

function getEthersProvider(
  ethereumProvider: object | undefined,
  network: Network
): ethersProviders.Provider {
  // Ethers compatibility: ethereum => homestead
  if (network.name === 'ethereum' && network.chainId === 1) {
    network = { ...network, name: 'homestead' }
  }

  if (ethereumProvider) {
    try {
      return new ethersProviders.Web3Provider(ethereumProvider, network)
    } catch (err) {
      console.error('Invalid provider:', ethereumProvider)
      throw err
    }
  }

  if (network.chainId === 100) {
    return new ethersProviders.WebSocketProvider(XDAI_WSS_ENDPOINT, network)
  }

  return getDefaultEthersProvider(network)
}

async function resolveAddress(
  ethersProvider: ethersProviders.Provider,
  location: string
): Promise<Address> {
  const address = ethersUtils.isAddress(location)
    ? location
    : await ethersProvider.resolveName(location)

  if (!ethersUtils.isAddress(address)) {
    throw new Error('Please provide a valid address or ENS domain.')
  }

  return address
}

async function connect(
  location: string,
  connector: ConnectorDeclaration,
  {
    actAs,
    ethereum: ethereumProvider,
    ipfs,
    network,
    verbose,
  }: ConnectOptions = {}
): Promise<Organization> {
  const _network = toNetwork(network ?? 'ethereum')

  const ethersProvider = getEthersProvider(ethereumProvider, _network)
  const orgConnector = getConnector(connector, _network)

  const orgAddress = await resolveAddress(ethersProvider, location)

  const connectionContext = {
    actAs: actAs || null,
    ethereumProvider: ethereumProvider || null,
    ethersProvider,
    ipfs: getIpfsResolver(ipfs),
    network: _network,
    orgAddress,
    orgConnector,
    orgLocation: location,
    verbose: verbose ?? false,
  }

  await orgConnector.connect?.(connectionContext)

  return new Organization(connectionContext)
}

export default connect
