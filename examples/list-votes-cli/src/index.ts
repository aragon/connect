import { connect } from '@aragon/connect'
import connectVoting from '@aragon/connect-thegraph-voting'

const BLUE = '\x1b[36m'
const RESET = '\x1b[0m'

// const env = {
//   chainId: 4,
//   location: 'gardens.aragonid.eth',
// }

const env = {
  chainId: 1,
  location: 'governance.aragonproject.eth',
}

async function main() {
  const org = await connect(env.location, 'thegraph', { chainId: env.chainId })
  const voting = await connectVoting(org.app('voting'))
  const votes = await voting.votes()

  printOrganization(org)
  printVotes(votes)
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
  let str = vote.metadata
  str = str.replace(/\n/g, ' ')
  return str.length > 60 ? str.slice(0, 60) + '…' : str
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('')
    console.error(err)
    console.log(
      'Please report any problem to https://github.com/aragon/connect/issues'
    )
    process.exit(1)
  })
