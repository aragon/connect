import { connect } from '@aragon/connect'
import connectVoting, { Voting } from '@aragon/connect-voting'

const BLUE = '\x1b[36m'
const RESET = '\x1b[0m'

const env = {
  network: parseInt(process.env.CHAIN_ID ?? '1', 10),
  location: process.env.ORGANIZATION ?? 'governance.aragonproject.eth',
}

async function main() {
  const org = await connect(env.location, 'thegraph', { network: env.network })
  const voting = await connectVoting(org.app('voting'))

  console.log("Fetching votes and casts in separate calls...")
  const votes = await voting.votes({ first: 100 })
  const votesWithCasts = await Promise.all(
    votes.map(async (vote) => ({ ...vote, casts: await vote.casts() }))
  )

  printOrganization(org)
  printVotes(votesWithCasts)

  console.log("Fetching votes and casts in one call...")
  const votesAndCastsBundled = await voting.votesWithCasts({ first: 100 })
  printVotes(votesAndCastsBundled)
}

function printOrganization(organization: any) {
  console.log('')
  console.log(' Organization')
  console.log('')
  console.log('  Location:', BLUE + organization.location + RESET)
  console.log('  Address:', BLUE + organization.address + RESET)
  console.log('')
}

function printVotes(votes: any) {
  console.log(` Votes (${votes.length})`)
  console.log('')
  for (const vote of votes) {
    console.log('  Vote:', `${BLUE}${formatVote(vote)}${RESET}`)
  }
  console.log('')
}

function formatVote(vote: any): string {
  let label = vote.metadata
  label = label.replace(/\n/g, ' ')
  label = label.length > 60 ? label.slice(0, 60) + '…' : label
  const numCasts = vote.castVotes ? vote.castVotes.length : vote.casts.length
  return `(${numCasts} casts) ${label || '[Action]'}`
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('')
    console.error(err)
    console.log(
      'Please report any problem to https://github.com/aragon/connect/issues'
    )
    process.exit(1)
  })
