import { VotingConnectorTheGraph, Cast } from '../../src'

const VOTING_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-voting-goerli'
const VOTING_APP_ADDRESS = '0xeba3dad2d34d29208e6404ec3ab54979ef5a6cbb'

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

      const vote = votes[1]

      const casts = await vote.casts()
      cast = casts[0]
    })

    test('was done by the correct voter', () => {
      expect(cast.voter.address).toBe(
        '0x5523f2fc0889a6d46ae686bcd8daa9658cf56496'
      )
    })

    test('shows the correct support', () => {
      expect(cast.supports).toBe(true)
    })
  })
})
