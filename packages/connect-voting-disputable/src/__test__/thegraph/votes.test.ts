import { DisputableVotingConnectorTheGraph, Vote, CastVote } from '../../../src'

const VOTING_APP_ADDRESS = '0x26e14ed789b51b5b226d69a5d40f72dc2d0180fe'
const VOTING_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/facuspagnuolo/aragon-dvoting-rinkeby-staging'

describe('DisputableVoting votes', () => {
  let connector: DisputableVotingConnectorTheGraph

  beforeAll(() => {
    connector = new DisputableVotingConnectorTheGraph(VOTING_SUBGRAPH_URL)
  })

  afterAll(async () => {
    await connector.disconnect()
  })

  describe('vote', () => {
    let vote: Vote

    beforeAll(async () => {
      vote = await connector.vote(`${VOTING_APP_ADDRESS}-vote-4`)
    })

    test('returns the requested vote information', () => {
      expect(vote.id).toBe(`${VOTING_APP_ADDRESS}-vote-4`)
      expect(vote.voteId).toEqual('4')
      expect(vote.votingId).toBe(VOTING_APP_ADDRESS)
      expect(vote.settingId).toBe(`${VOTING_APP_ADDRESS}-setting-0`)
      expect(vote.actionId).toBe('5')
      expect(vote.context).toBe('Delfi test')
      expect(vote.status).toBe('Scheduled')
      expect(vote.creator).toBe('0x0090aed150056316e37fe6dfa10dc63e79d173b6')
      expect(vote.startDate).toBe('1596383789')
      expect(vote.votingPower).toBe('4000000000000000000')
      expect(vote.snapshotBlock).toBe('6948545')
      expect(vote.yeas).toBe('1000000000000000000')
      expect(vote.nays).toBe('1000000000000000000')
      expect(vote.pausedAt).toBe('0')
      expect(vote.pauseDuration).toBe('0')
      expect(vote.quietEndingExtendedSeconds).toBe('0')
      expect(vote.quietEndingSnapshotSupport).toBe('Absent')
      expect(vote.script).toBe('0x00000001')
    })

    it('allows fetching the cast votes', async () => {
      const castVotes: CastVote[] = await vote.castVotes()
      expect(castVotes.length).toBeGreaterThan(1)

      const firstCastVote = castVotes[0]
      expect(firstCastVote.id).toBe(`${VOTING_APP_ADDRESS}-vote-4-cast-0x0090aed150056316e37fe6dfa10dc63e79d173b6`)
      expect(firstCastVote.caster).toBe('0x0090aed150056316e37fe6dfa10dc63e79d173b6')
      expect(firstCastVote.createdAt).toEqual('1596383834')
      expect(firstCastVote.stake).toBe('1000000000000000000')
      expect(firstCastVote.supports).toBe(true)

      const secondCastVote = castVotes[1]
      expect(secondCastVote.id).toBe(`${VOTING_APP_ADDRESS}-vote-4-cast-0xa9ac50dce74c46025dc9dceafb4fa21f0dc142ea`)
      expect(secondCastVote.caster).toBe('0xa9ac50dce74c46025dc9dceafb4fa21f0dc142ea')
      expect(secondCastVote.createdAt).toEqual('1596394454')
      expect(secondCastVote.stake).toBe('1000000000000000000')
      expect(secondCastVote.supports).toBe(false)
    })
  })

  describe('votes', () => {
    let votes: Vote[]

    beforeAll(async () => {
      votes = await connector.votes(VOTING_APP_ADDRESS, 1000, 0)
    })

    test('returns a list of votes', () => {
      expect(votes.length).toBeGreaterThan(4)
    })

    test('allows fetching a single vote', () => {
      const vote = votes[2]

      expect(vote.id).toBe(`${VOTING_APP_ADDRESS}-vote-2`)
      expect(vote.voteId).toEqual('2')
      expect(vote.votingId).toBe(VOTING_APP_ADDRESS)
      expect(vote.settingId).toBe(`${VOTING_APP_ADDRESS}-setting-0`)
      expect(vote.actionId).toBe('3')
      expect(vote.status).toBe('Cancelled')
      expect(vote.context).toBe('Context for action 3')
      expect(vote.creator).toBe('0x0090aed150056316e37fe6dfa10dc63e79d173b6')
      expect(vote.startDate).toBe('1596302414')
      expect(vote.votingPower).toBe('3000000000000000000')
      expect(vote.snapshotBlock).toBe('6943120')
      expect(vote.yeas).toBe('0')
      expect(vote.nays).toBe('0')
      expect(vote.pausedAt).toBe('1596302459')
      expect(vote.pauseDuration).toBe('15')
      expect(vote.quietEndingExtendedSeconds).toBe('0')
      expect(vote.quietEndingSnapshotSupport).toBe('Absent')
      expect(vote.script).toBe('0x00000001')
    })
  })
})

