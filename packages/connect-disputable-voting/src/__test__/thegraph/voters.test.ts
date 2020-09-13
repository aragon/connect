import { DisputableVotingConnectorTheGraph, Voter } from '../../../src'

const VOTER_ADDRESS = '0x0090aed150056316e37fe6dfa10dc63e79d173b6'
const VOTING_APP_ADDRESS = '0x0e835020497b2cd716369f8fc713fb7bd0a22dbf'
const VOTING_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/facuspagnuolo/aragon-dvoting-rinkeby-staging'

describe('DisputableVoting voters', () => {
  let connector: DisputableVotingConnectorTheGraph

  beforeAll(() => {
    connector = new DisputableVotingConnectorTheGraph({
      subgraphUrl: VOTING_SUBGRAPH_URL,
    })
  })

  afterAll(async () => {
    await connector.disconnect()
  })

  describe('voter', () => {
    let voter: Voter

    beforeAll(async () => {
      voter = await connector.voter(
        `${VOTING_APP_ADDRESS}-voter-${VOTER_ADDRESS}`
      )
    })

    test('allows fetching voter information', async () => {
      expect(voter.id).toBe(`${VOTING_APP_ADDRESS}-voter-${VOTER_ADDRESS}`)
      expect(voter.address).toBe(VOTER_ADDRESS)
      expect(voter.representative).toBe(null)
      expect(voter.votingId).toBe(VOTING_APP_ADDRESS)
    })
  })
})
