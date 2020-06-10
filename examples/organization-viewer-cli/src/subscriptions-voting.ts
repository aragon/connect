import { Voting, VotingVote, VotingCast } from '@aragon/connect-thegraph-voting'

const VOTING_APP_ADDRESS = '0xc73e86aab9d232495399d62fc80a36ae52952b81'
const ALL_VOTING_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/ajsantander/aragon-voting-rinkeby'

async function main() {
  const voting = new Voting(VOTING_APP_ADDRESS, ALL_VOTING_SUBGRAPH_URL)

  const subscription = voting.onVotes((votes: VotingVote[]) => {
    votes.map((vote: VotingVote) =>
      console.log(vote.toString())
    )
  })

  await keepRunning()

  // Simply to illustrate how to close a subscription
  subscription.unsubscribe()
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
