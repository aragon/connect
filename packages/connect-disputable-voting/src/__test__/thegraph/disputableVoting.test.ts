import { DisputableVotingData } from '../../types'
import { DisputableVotingConnectorTheGraph } from '../../../src'

const VOTING_APP_ADDRESS = '0x0e835020497b2cd716369f8fc713fb7bd0a22dbf'
const VOTING_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/facuspagnuolo/aragon-dvoting-rinkeby-staging'

describe('DisputableVoting', () => {
  let connector: DisputableVotingConnectorTheGraph

  beforeAll(() => {
    connector = new DisputableVotingConnectorTheGraph({
      subgraphUrl: VOTING_SUBGRAPH_URL,
    })
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
        '0x51a41e43af0774565f0be5cebc50c693cc19e4ee'
      )
      expect(disputableVoting.token).toBe(
        '0x9a8eab8a356b8af4fa6ea5be983539ce97a258fb'
      )
    })
  })
})
