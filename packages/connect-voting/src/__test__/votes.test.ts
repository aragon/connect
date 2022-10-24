import { VotingConnectorTheGraph, Vote, Cast } from '../../src'

const VOTING_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-voting-goerli'
const VOTING_APP_ADDRESS = '0x0cf8fe5c21fd283e66c1d42bbe0b2e64fb30295d'

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
        vote = votes[2]
      })

      test('should not be executed', () => {
        expect(vote.executed).toBe(false)
      })

      test('should have nays', () => {
        expect(vote.nay).toBe('1')
      })

      test('should have yeas', () => {
        expect(vote.yea).toBe('0')
      })

      test('has the expected script', () => {
        expect(vote.script).toEqual(
          '0x000000015149e6f6835516b3c7f6919acb1e325d8457decd000000a4f636484600000000000000000000000000000000000000000000000000000000000000000000000000000000000000006306d7bed25e0d75a96e975e229a0dac424fd61100000000000000000000000000000000000000000000000000354a6ba7a1800000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000'
        )
      })

      test('should have a valid creator', () => {
        expect(vote.creator).toEqual(
          '0x29d8027490f66104007e83d8c4f1901e43d8365f'
        )
      })

      test('should have a valid original creator', () => {
        expect(vote.originalCreator).toBe('0x4138f6d0cb2c35e3cd92e96569e6e3cd065a9990')
      })

      test('should have valid metadata', () => {
        expect(vote.metadata).toEqual(``)
      })

      test('should have a valid minAcceptQuorum', () => {
        expect(vote.minAcceptQuorum).toEqual('310000000000000000')
      })

      test('should have a valid supportRequiredPct', () => {
        expect(vote.supportRequiredPct).toEqual('500000000000000000')
      })

      test('should have a valid votingPower', () => {
        expect(vote.votingPower).toEqual('3')
      })

      test('should have a valid snapshotBlock', () => {
        expect(vote.snapshotBlock).toEqual('7784328')
      })

      test('should have a valid startDate', () => {
        expect(vote.startDate).toEqual('1665996744')
      })

      describe('when querying for the casts of a vote', () => {
        let casts: Cast[]

        beforeAll(async () => {
          casts = await vote.casts()
        })

        test('retrieves casts', () => {
          expect(casts.length).toBe(0)
        })
      })
    })
  })
})
