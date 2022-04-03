import { VotingConnectorTheGraph, Vote, Cast } from '../../src'

const VOTING_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-voting-rinkeby-staging'
const VOTING_APP_ADDRESS = '0x37187b0f2089b028482809308e776f92eeb7334e'

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
        vote = votes[13]
      })

      test('should not be executed', () => {
        expect(vote.executed).toBe(false)
      })

      test('should have nays', () => {
        expect(vote.nay).toBe('18000000000000000000000')
      })

      test('should have yeas', () => {
        expect(vote.yea).toBe('5400000000000000000000')
      })

      test('has the expected script', () => {
        expect(vote.script).toEqual(
          '0x0000000138daca8c123145ead833c42590f4e359fd6bfa0c00000124d948d468000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000e0000000015616500b003475136ee6b0844896a2e1ccc68140000000c4d948d46800000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000080000000018b8fc0e17c2900d669cc883e3b067e413536240200000064b0c8f9dc000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000076e65776e616d6500000000000000000000000000000000000000000000000000'
        )
      })

      test('should have a valid creator', () => {
        expect(vote.creator).toEqual(
          '0xadb56e6b6a10c8a1b7fe859b1284cfd74a7bcd1f'
        )
      })

      test('should have a valid original creator', () => {
        expect(vote.originalCreator).toBe(
          '0x8cff6832174091dae86f0244e3fd92d4ced2fe07'
        )
      })

      test('should have valid metadata', () => {
        expect(vote.metadata).toEqual(``)
      })

      test('should have a valid minAcceptQuorum', () => {
        expect(vote.minAcceptQuorum).toEqual('10000000000000000')
      })

      test('should have a valid supportRequiredPct', () => {
        expect(vote.supportRequiredPct).toEqual('250000000000000000')
      })

      test('should have a valid votingPower', () => {
        expect(vote.votingPower).toEqual('29531000000000000000000')
      })

      test('should have a valid snapshotBlock', () => {
        expect(vote.snapshotBlock).toEqual('7167970')
      })

      test('should have a valid startDate', () => {
        expect(vote.startDate).toEqual('1599675534')
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
