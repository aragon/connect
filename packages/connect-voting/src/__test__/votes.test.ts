import { VotingConnectorTheGraph, Vote, Cast } from '../../src'

const VOTING_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-voting-mainnet'
const VOTING_APP_ADDRESS = '0x277bfcf7c2e162cb1ac3e9ae228a3132a75f83d4'

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

  describe('when querying for all the votes of a voting app', () => {
    let votes: Vote[]

    beforeAll(async () => {
      votes = await connector.votesForApp(VOTING_APP_ADDRESS, 1000, 0)
    })

    test('returns a list of votes', () => {
      expect(votes.length).toBeGreaterThan(0)
    })

    describe('when looking at a vote', () => {
      let vote: Vote

      beforeAll(() => {
        vote = votes[0]
      })

      test('should not be executed', () => {
        expect(vote.executed).toBe(false)
      })

      test('should have nays', () => {
        expect(vote.nay).toBe('89990168634229999999839')
      })

      test('should have yeas', () => {
        expect(vote.yea).toBe('3020546281689066542494264')
      })

      test('has the expected script', () => {
        expect(vote.script).toEqual('0x')
      })

      test('should have a valid creator', () => {
        expect(vote.creator).toEqual(
          '0xcafe1a77e84698c83ca8931f54a755176ef75f2c'
        )
      })

      test('should have valid metadata', () => {
        expect(vote.metadata).toEqual(`Do you approve AGP-5?
SHA256: 723fc1bab8ce83d021a1c64d78d070041b10629ea78a8b9651fd89aa9a040f9b
Link: https://github.com/aragon/AGPs/blob/master/AGPs/AGP-5.md`)
      })

      test('should have a valid minAcceptQuorum', () => {
        expect(vote.minAcceptQuorum).toEqual('0')
      })

      test('should have a valid supportRequiredPct', () => {
        expect(vote.supportRequiredPct).toEqual('500000000000000000')
      })

      test('should have a valid votingPower', () => {
        expect(vote.votingPower).toEqual('39609523809523809540000000')
      })

      test('should have a valid snapshotBlock', () => {
        expect(vote.snapshotBlock).toEqual('7116241')
      })

      test('should have a valid startDate', () => {
        expect(vote.startDate).toEqual('1548287965')
      })

      describe('when querying for the casts of a vote', () => {
        let casts: Cast[]

        beforeAll(async () => {
          casts = await vote.casts()
        })

        test('retrieves casts', () => {
          expect(casts.length).toBeGreaterThan(0)
        })
      })
    })
  })
})
