import { connect } from '@aragon/connect'
import { DisputableVoting, DisputableVotingConnectorTheGraph } from '../../src'

export const RINKEBY_NETWORK = 4
export const ORGANIZATION_NAME = 'ancashdao.aragonid.eth'
export const VOTING_APP_ADDRESS = '0x0e835020497b2cd716369f8fc713fb7bd0a22dbf'
export const VOTING_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/facuspagnuolo/aragon-dvoting-rinkeby-staging'

export async function buildConnector(
  organizationNameOrAddress: string = ORGANIZATION_NAME,
  network: number = RINKEBY_NETWORK,
  subgraphUrl: string = VOTING_SUBGRAPH_URL,
): Promise<DisputableVotingConnectorTheGraph> {
  const organization = await connect(organizationNameOrAddress, 'thegraph', { network })
  return new DisputableVotingConnectorTheGraph({ subgraphUrl }, organization.connection.ethersProvider)
}

export async function buildDisputableVoting(
  organizationNameOrAddress: string = ORGANIZATION_NAME,
  network: number = RINKEBY_NETWORK,
  subgraphUrl: string = VOTING_SUBGRAPH_URL,
  votingAppAddress: string = VOTING_APP_ADDRESS
): Promise<DisputableVoting> {
  const organization = await connect(organizationNameOrAddress, 'thegraph', { network })
  const connector = new DisputableVotingConnectorTheGraph({ subgraphUrl }, organization.connection.ethersProvider)
  const app = await organization.connection.orgConnector.appByAddress(organization, votingAppAddress)
  return new DisputableVoting(connector, app)
}
