import { DisputableVotingData } from '../../types'
import { DisputableVotingConnectorTheGraph } from '../../../src'

const VOTING_APP_ADDRESS = '0x26e14ed789b51b5b226d69a5d40f72dc2d0180fe'
const VOTING_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/facuspagnuolo/aragon-dvoting-rinkeby-staging'

describe('DisputableVoting', () => {
  let connector: DisputableVotingConnectorTheGraph

  beforeAll(() => {
    connector = new DisputableVotingConnectorTheGraph(VOTING_SUBGRAPH_URL)
  })

  afterAll(async () => {
    await connector.disconnect()
  })

  describe('data', () => {
    let disputableVoting: DisputableVotingData

    beforeAll(async () => {
      disputableVoting = await connector.disputableVoting(VOTING_APP_ADDRESS)
    })

    test('returns the disputable voting data', () => {
      expect(disputableVoting.id).toBe(VOTING_APP_ADDRESS)
      expect(disputableVoting.dao).toBe(
        '0xa6e4b08981ae324f16d6be39362f6de2da22882a'
      )
      expect(disputableVoting.token).toBe(
        '0x991f49aad101db17ff02d8d867a880703bface62'
      )
    })
  })
})
