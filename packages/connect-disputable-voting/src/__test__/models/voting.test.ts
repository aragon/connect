import { ethers } from 'ethers'
import { connect } from '@aragon/connect'

import {
  ERC20,
  DisputableVoting,
  CollateralRequirement,
  DisputableVotingConnectorTheGraph,
} from '../../../src'
import {bn} from "@aragon/connect-agreement/dist/esm/helpers";


const RINKEBY_NETWORK = 4
const ORGANIZATION_NAME = 'ancashdao.aragonid.eth'
const VOTING_APP_ADDRESS = '0x0e835020497b2cd716369f8fc713fb7bd0a22dbf'
const VOTING_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/facuspagnuolo/aragon-dvoting-rinkeby-staging'

describe('DisputableVoting', () => {
  let voting: DisputableVoting

  beforeAll(async () => {
    const organization = await connect(ORGANIZATION_NAME, 'thegraph', { network: RINKEBY_NETWORK })
    const connector = new DisputableVotingConnectorTheGraph({ subgraphUrl: VOTING_SUBGRAPH_URL })
    const app = await organization.connection.orgConnector.appByAddress(organization, VOTING_APP_ADDRESS)
    voting = new DisputableVoting(connector, app)
  })

  afterAll(async () => {
    await voting.disconnect()
  })

  describe('current collateral requirement', () => {
    let collateralRequirement: CollateralRequirement

    beforeEach(async () => {
      collateralRequirement = await voting.currentCollateralRequirement()
    })

    test('has a collateral requirement associated', async () => {
      expect(collateralRequirement.id).toBe(`${VOTING_APP_ADDRESS}-collateral-${collateralRequirement.collateralRequirementId}`)
      expect(collateralRequirement.tokenId).toBe('0x3af6b2f907f0c55f279e0ed65751984e6cdc4a42')
      expect(collateralRequirement.actionAmount).toBe('1000000000000000000')
      expect(collateralRequirement.formattedActionAmount).toBe('1.00')
      expect(collateralRequirement.challengeAmount).toBe('2000000000000000000')
      expect(collateralRequirement.formattedChallengeAmount).toBe('2.00')
      expect(collateralRequirement.challengeDuration).toBe('259200')
    })

    test('can requests the related token info', async () => {
      const token: ERC20 = await collateralRequirement.token()

      expect(token.id).toBe('0x3af6b2f907f0c55f279e0ed65751984e6cdc4a42')
      expect(token.name).toBe('DAI Token')
      expect(token.symbol).toBe('DAI')
      expect(token.decimals).toBe(18)
    })
  })

  describe('new vote', () => {
    const SCRIPT = '0x00000001'
    const CONTEXT = 'challenger evidence'
    const SIGNER_ADDRESS = '0x0090aed150056316e37fe6dfa10dc63e79d173b6'

    it('returns a new vote intent', async () => {
      const votingABI = new ethers.utils.Interface(['function newVote(bytes,bytes)'])
      const intent = await voting.newVote(SCRIPT, CONTEXT, SIGNER_ADDRESS)

      expect(intent.transactions.length).toBe(1)
      expect(intent.destination.address).toBe(VOTING_APP_ADDRESS)

      const transaction = intent.transactions[0]
      expect(transaction.to.toLowerCase()).toBe(VOTING_APP_ADDRESS)
      expect(transaction.from).toBe(SIGNER_ADDRESS)
      expect(transaction.data).toBe(votingABI.encodeFunctionData('newVote', [SCRIPT, ethers.utils.toUtf8Bytes(CONTEXT)]))
    })
  })
})
