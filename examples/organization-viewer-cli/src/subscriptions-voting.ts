import { Voting, VotingVote, VotingCast } from '@aragon/connect-thegraph-voting'

const VOTING_APP_ADDRESS = '0xc73e86aab9d232495399d62fc80a36ae52952b81'
const ALL_VOTING_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/aragon/aragon-voting-rinkeby-staging'

async function main() {
  const voting = new Voting(
    VOTING_APP_ADDRESS,
    ALL_VOTING_SUBGRAPH_URL
  )

  const votesSubscription = voting.onVotes((votes: VotingVote[]) => {
    votes.map(console.log)
  })

  const votes = await voting.votes()
  const lastVote = votes[votes.length - 1]
  console.log(`last`, lastVote)

  const castsSubscription = lastVote.onCasts((casts: VotingCast[]) => {
    console.log(`\nCasts:`)
    casts.map(console.log)
  })

  await keepRunning()

  // Simply to illustrate how to close a subscription
  votesSubscription.unsubscribe()
  castsSubscription.unsubscribe()
}

async function keepRunning() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, 1000000000)
  })
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(`err`, err)
    process.exit(1)
  })
