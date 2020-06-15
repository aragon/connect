import { connect } from '@aragon/connect'
import { Cast, Vote, Voting } from '@aragon/connect-thegraph-voting'

type Env = { chainId: number; org: string; votingSubgraphUrl: string }

const envs = new Map(
  Object.entries({
    rinkeby: {
      chainId: 4,
      org: 'mesh.aragonid.eth',
      votingSubgraphUrl:
        'https://api.thegraph.com/subgraphs/name/aragon/aragon-voting-rinkeby',
    },
    mainnet: {
      chainId: 1,
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
  return vote.metadata
    .split('\n')[0]
    .replace(/\(Link[^\)]+\)/, '')
    .replace(/\(SHA256[^\)]+\)/, '')
}

function voteId(vote: Vote) {
  return (
    '#' +
    String(parseInt(vote.id.match(/voteId:(.+)$/)?.[1] || '0')).padEnd(2, ' ')
  )
}

async function main() {
  const org = await connect(env.org, 'thegraph', { chainId: env.chainId })
  const apps = await org.apps()
  const votingApp = apps.find(app => app.appName === 'voting.aragonpm.eth')

  console.log('\nOrganization:', org.location, `(${org.address})`)

  if (!votingApp?.address) {
    console.log('\nNo voting app found in this organization')
    return
  }

  console.log(`\nVoting app: ${votingApp.address}`)

  const voting = new Voting(votingApp.address, env.votingSubgraphUrl)

  console.log(`\nVotes:`)
  const votes = await voting.votes()

  console.log(
    votes.map(vote => `\n * ${voteId(vote)} ${voteTitle(vote)}`).join('') + '\n'
  )

  return
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
  casts.map(console.log)

  const voters = casts.map((cast: Cast) => cast.voter)
  console.log('Voters:', voters)
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err)
    console.error(
      '\nPlease report any problem to https://github.com/aragon/connect/issues'
    )
    process.exit(1)
  })
