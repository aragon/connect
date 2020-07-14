import { ethers } from 'ethers'
import {
  ConnectionContext,
  ConnectorJson,
  ConnectorJsonConfig,
  IOrganizationConnector,
  Organization,
} from '@aragon/connect-core'
import ConnectorEthereum, {
  ConnectorEthereumConfig,
} from '@aragon/connect-ethereum'
import ConnectorTheGraph, {
  ConnectorTheGraphConfig,
} from '@aragon/connect-thegraph'
import { Address, Network } from '@aragon/connect-types'

const XDAI_WSS_ENDPOINT = 'wss://xdai.poanetwork.dev/wss'
const DEFAULT_IPFS_URL = 'https://ipfs.eth.aragon.network/{cid}{path}'

export type IpfsUrlResolver = (cid: string, path?: string) => string

export type ConnectOptions = {
  actAs?: string
  chainId?: number
  ethereum?: object
  ipfs?: IpfsUrlResolver | string
}

export type ConnectorDeclaration =
  | IOrganizationConnector
  | [string, object | undefined]
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

function getNetwork(chainId?: number): Network {
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
  throw new Error(`Invalid chainId provided: ${chainId}`)
}

function getEthersProvider(
  ethereumProvider: object | undefined,
  network: Network
): ethers.providers.Provider {
  if (ethereumProvider) {
    try {
      return new ethers.providers.Web3Provider(ethereumProvider, network)
    } catch (err) {
      console.error('Invalid provider:', ethereumProvider)
      throw err
    }
  }
  if (network.chainId === 100) {
    return new ethers.providers.WebSocketProvider(XDAI_WSS_ENDPOINT, network)
  }
  return ethers.getDefaultProvider(network)
}

async function resolveAddress(
  ethersProvider: ethers.providers.Provider,
  location: string
): Promise<Address> {
  const address = ethers.utils.isAddress(location)
    ? location
    : await ethersProvider.resolveName(location)

  if (!ethers.utils.isAddress(address)) {
    throw new Error('Please provide a valid address or ENS domain.')
  }

  return address
}

async function connect(
  location: string,
  connector: ConnectorDeclaration,
  { actAs, chainId, ethereum: ethereumProvider, ipfs }: ConnectOptions = {}
): Promise<Organization> {
  const network = getNetwork(chainId)
  const ethersProvider = getEthersProvider(ethereumProvider, network)
  const orgConnector = getConnector(connector, network)

  // Two independent tasks in parallel are done here:
  //  - Resolving the organization address.
  //  - Calling .connect() on the connector.
  const [orgAddress] = await Promise.all([
    resolveAddress(ethersProvider, location),
    orgConnector.connect?.(),
  ])

  const connectionContext = {
    actAs: actAs || null,
    ethereumProvider: ethereumProvider || null,
    ethersProvider,
    ipfs: getIpfsResolver(ipfs),
    network,
    orgAddress,
    orgConnector,
    orgLocation: location,
  }

  return new Organization(connectionContext)
}

export default connect
