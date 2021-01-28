import { buildConnector, VOTING_APP_ADDRESS } from '../utils'
import { DisputableVotingConnectorTheGraph, Voter } from '../../../src'

describe('DisputableVoting voters', () => {
  let connector: DisputableVotingConnectorTheGraph

  beforeAll(async () => {
    connector = await buildConnector()
  })

  afterAll(async () => {
    await connector.disconnect()
  })

  describe('voter', () => {
    let voter: Voter
    const VOTER_ADDRESS = '0x0090aed150056316e37fe6dfa10dc63e79d173b6'

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
