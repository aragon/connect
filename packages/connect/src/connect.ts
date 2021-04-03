import { Organization, resolveAddress, toNetwork } from '@1hive/connect-core'
import { ConnectorDeclaration, ConnectOptions } from './types'
import {
  normalizeConnector,
  normalizeEthersProvider,
  normalizeIpfsResolver,
} from './normalizers'

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

  const ethersProvider = normalizeEthersProvider(ethereumProvider, _network)
  const orgConnector = normalizeConnector(connector, _network)

  const orgAddress = await resolveAddress(ethersProvider, location)

  const connectionContext = {
    actAs: actAs || null,
    ethereumProvider: ethereumProvider || null,
    ethersProvider,
    ipfs: normalizeIpfsResolver(ipfs),
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
