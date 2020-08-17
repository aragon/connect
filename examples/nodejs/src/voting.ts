import { connect } from '@aragon/connect'
import connectVoting, { Cast, Vote, Voting } from '@aragon/connect-voting'

type Env = { network: number; org: string; votingSubgraphUrl: string }

const envs = new Map(
  Object.entries({
    rinkeby: {
      network: 4,
      org: 'gardens.aragonid.eth',
      votingSubgraphUrl:
        'https://api.thegraph.com/subgraphs/name/aragon/aragon-voting-rinkeby',
    },
    mainnet: {
      network: 1,
      org: 'governance.aragonproject.eth',
      votingSubgraphUrl:
        'https://api.thegraph.com/subgraphs/name/aragon/aragon-voting-mainnet',
    },
  })
)

const env =
  envs.get(process.env.ETH_NETWORK || '') || (envs.get('mainnet') as Env)

function voteTitle(vote: Vote) {
  // Filtering out the extra data on governance.aragonproject.eth votes
  return (
    vote.metadata
      .split('\n')[0]
      .replace(/\(Link[^\)]+\)/, '')
      .replace(/\(SHA256[^\)]+\)/, '') || 'Untitled'
  )
}

function voteId(vote: Vote) {
  return (
    '#' +
    String(parseInt(vote.id.match(/voteId:(.+)$/)?.[1] || '0')).padEnd(2, ' ')
  )
}

async function main() {
  const org = await connect(env.org, 'thegraph', { network: env.network })
  const voting = await connectVoting(org.app('voting'))

  console.log('\nOrganization:', org.location, `(${org.address})`)
  console.log(`\nVoting app: ${voting.address}`)

  console.log(`\nVotes:`)
  const votes = await voting.votes()

  console.log(
    votes.map((vote) => `\n * ${voteId(vote)} ${voteTitle(vote)}`).join('') +
      '\n'
  )

  if (votes.length === 0) {
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
  casts.map(console.log)

  const voters = casts.map((cast: Cast) => cast.voter)
  console.log('Voters:', voters)
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
