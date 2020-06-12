import { VotingConnectorTheGraph, Vote } from '../../src'

const VOTING_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/aragon/aragon-voting-rinkeby'
const VOTING_APP_ADDRESS = '0xc73e86aab9d232495399d62fc80a36ae52952b81'

describe('when connecting to a voting app', () => {
  let connector: VotingConnectorTheGraph

  beforeAll(() => {
    connector = new VotingConnectorTheGraph(
      VOTING_SUBGRAPH_URL
    )
  })

  describe('when querying for all the votes of a voting app', () => {
    let votes: Vote[]

    beforeAll(async () => {
      votes = await connector.votesForApp(
        VOTING_APP_ADDRESS,
        1000, 0
      )
    })

    test('returns a list of votes', () => {
      expect(votes.length).toBeGreaterThan(0)
    })

    describe('when looking at a vote', () => {
      let vote: Vote

      beforeAll(() => {
        vote = votes[0]
      })

      test('should be executed', () => {
        expect(vote.executed).toBe(true)
      })

      test('should have no nays', () => {
        expect(vote.nay).toBe('0')
      })

      // TODO: Unskip when bug in subgraph is fixed
      test.skip('should have yeas', () => {
        expect(vote.yea).toBe('1000000000000000000')
      })

      test('has the expected script', () => {
        expect(vote.script).toEqual('0x00000001')
      })

      test('should have a valid creator', () => {
        expect(vote.creator).toEqual('0xb5146c785a64fefc17bcbae1f07ad0000e300442')
      })

      test('should have valid metadata', () => {
        expect(vote.metadata).toEqual('Vote 1')
      })

      test('should have a valid minAcceptQuorum', () => {
        expect(vote.minAcceptQuorum).toEqual('150000000000000000')
      })

      test('should have a valid supportRequiredPct', () => {
        expect(vote.supportRequiredPct).toEqual('500000000000000000')
      })

      test('should have a valid votingPower', () => {
        expect(vote.votingPower).toEqual('1000000000000000000')
      })

      test('should have a valid snapshotBlock', () => {
        expect(vote.snapshotBlock).toEqual('6453522')
      })

      test('should have a valid startDate', () => {
        expect(vote.startDate).toEqual('1588958283')
      })
    })
  })
})

