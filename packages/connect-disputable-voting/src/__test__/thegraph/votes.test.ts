import { DisputableVotingConnectorTheGraph, Vote, CastVote } from '../../../src'

const VOTING_APP_ADDRESS = '0x0e835020497b2cd716369f8fc713fb7bd0a22dbf'
const VOTING_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-dvoting-rinkeby-staging'

describe('DisputableVoting votes', () => {
  let connector: DisputableVotingConnectorTheGraph

  beforeAll(() => {
    connector = new DisputableVotingConnectorTheGraph({
      subgraphUrl: VOTING_SUBGRAPH_URL,
    })
  })

  afterAll(async () => {
    await connector.disconnect()
  })

  describe('vote', () => {
    let vote: Vote

    beforeAll(async () => {
      vote = await connector.vote(`${VOTING_APP_ADDRESS}-vote-3`)
    })

    test('returns the requested vote information', () => {
      expect(vote.id).toBe(`${VOTING_APP_ADDRESS}-vote-3`)
      expect(vote.voteId).toEqual('3')
      expect(vote.votingId).toBe(VOTING_APP_ADDRESS)
      expect(vote.settingId).toBe(`${VOTING_APP_ADDRESS}-setting-0`)
      expect(vote.actionId).toBe('4')
      expect(vote.context).toBe('Context for action 4')
      expect(vote.voteStatus).toBe('Disputed')
      expect(vote.creator).toBe('0x0090aed150056316e37fe6dfa10dc63e79d173b6')
      expect(vote.startDate).toBe('1598480213')
      expect(vote.totalPower).toBe('3000000000000000000')
      expect(vote.snapshotBlock).toBe('7088291')
      expect(vote.yeas).toBe('0')
      expect(vote.nays).toBe('0')
      expect(vote.pausedAt).toBe('1598480258')
      expect(vote.pauseDuration).toBe('0')
      expect(vote.quietEndingExtensionDuration).toBe('0')
      expect(vote.quietEndingSnapshotSupport).toBe('Absent')
      expect(vote.script).toBe('0x00000001')
    })

    it.skip('allows fetching the cast votes', async () => {
      const castVotes: CastVote[] = await vote.castVotes()
      expect(castVotes.length).toBeGreaterThan(1)

      const firstCastVote = castVotes[0]
      expect(firstCastVote.id).toBe(
        `${VOTING_APP_ADDRESS}-vote-3-cast-0x0090aed150056316e37fe6dfa10dc63e79d173b6`
      )
      expect(firstCastVote.caster).toBe(
        '0x0090aed150056316e37fe6dfa10dc63e79d173b6'
      )
      expect(firstCastVote.createdAt).toEqual('1596383834')
      expect(firstCastVote.stake).toBe('1000000000000000000')
      expect(firstCastVote.supports).toBe(true)

      const secondCastVote = castVotes[1]
      expect(secondCastVote.id).toBe(
        `${VOTING_APP_ADDRESS}-vote-3-cast-0xa9ac50dce74c46025dc9dceafb4fa21f0dc142ea`
      )
      expect(secondCastVote.caster).toBe(
        '0xa9ac50dce74c46025dc9dceafb4fa21f0dc142ea'
      )
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
      expect(votes.length).toBeGreaterThan(3)
    })

    test('allows fetching a single vote', () => {
      const vote = votes[2]

      expect(vote.id).toBe(`${VOTING_APP_ADDRESS}-vote-2`)
      expect(vote.voteId).toEqual('2')
      expect(vote.votingId).toBe(VOTING_APP_ADDRESS)
      expect(vote.settingId).toBe(`${VOTING_APP_ADDRESS}-setting-0`)
      expect(vote.actionId).toBe('3')
      expect(vote.voteStatus).toBe('Cancelled')
      expect(vote.context).toBe('Context for action 3')
      expect(vote.creator).toBe('0x0090aed150056316e37fe6dfa10dc63e79d173b6')
      expect(vote.startDate).toBe('1598480123')
      expect(vote.totalPower).toBe('3000000000000000000')
      expect(vote.snapshotBlock).toBe('7088285')
      expect(vote.yeas).toBe('0')
      expect(vote.nays).toBe('0')
      expect(vote.pausedAt).toBe('1598480183')
      expect(vote.pauseDuration).toBe('15')
      expect(vote.quietEndingExtensionDuration).toBe('0')
      expect(vote.quietEndingSnapshotSupport).toBe('Absent')
      expect(vote.script).toBe('0x00000001')
    })
  })
})
