import { Voting, VotingVote, VotingCast } from '@aragon/connect-thegraph-voting'

const VOTING_APP_ADDRESS = '0xc73e86aab9d232495399d62fc80a36ae52952b81'
const ALL_VOTING_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-voting-rinkeby-staging'

async function main() {
  console.log('\nVoting:')

  const voting = new Voting(
    VOTING_APP_ADDRESS,
    ALL_VOTING_SUBGRAPH_URL
  )
  console.log(voting.toString())

  console.log('\nVotes:')
  const votes = await voting.votes()
  votes.map((vote: VotingVote) => console.log(vote.toString()))

  if (votes.length == 0) {
    return
  }

  console.log('\nAnalysis of a vote:')
  const vote = votes[0]
  console.log(
    `Vote for "${vote.metadata}" was ${
      vote.executed ? 'executed' : 'not executed'
    }, with ${vote.yea} yeas and ${vote.nay} nays.`
  )

  console.log('\nCasts:')
  const casts = await vote.casts()
  casts.map((cast: VotingCast) => console.log(cast.toString()))

  const voters = casts.map((cast: VotingCast) => cast.voter)
  console.log('Voters:', voters)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(`err`, err)
    process.exit(1)
  })
