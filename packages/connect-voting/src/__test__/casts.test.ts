import { VotingConnectorTheGraph, Vote, Cast } from '../../src'

const VOTING_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-voting-rinkeby'
const VOTING_APP_ADDRESS = '0xc73e86aab9d232495399d62fc80a36ae52952b81'

describe('when connecting to a voting app', () => {
  let connector: VotingConnectorTheGraph

  beforeAll(() => {
    connector = new VotingConnectorTheGraph({
      subgraphUrl: VOTING_SUBGRAPH_URL,
    })
  })

  afterAll(async () => {
    await connector.disconnect()
  })

  describe('when getting the first cast of a vote', () => {
    let cast: Cast

    beforeAll(async () => {
      const votes = await connector.votesForApp(VOTING_APP_ADDRESS, 1000, 0)

      const vote = votes[0]

      const casts = await vote.casts()
      cast = casts[0]
    })

    test('was done by the correct voter', () => {
      expect(cast.voter).toBe('0xb02dc25475988ca3f89f3b62cb1ff6b3031417df')
    })

    test('shows the correct support', () => {
      expect(cast.supports).toBe(true)
    })
  })
})
