import { connect } from '@aragon/connect'
import { Cast, Vote, Voting } from '@aragon/connect-thegraph-voting'

const ALL_VOTING_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-voting-rinkeby'
// const ALL_VOTING_SUBGRAPH_URL =
//   'https://api.thegraph.com/subgraphs/name/aragon/aragon-voting-mainnet'

function voteTitle(vote: Vote) {
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
  // const org = await connect('governance.aragonproject.eth', 'thegraph', {
  //   chainId: 1,
  // })
  const org = await connect('mesh.aragonid.eth', 'thegraph', { chainId: 4 })

  const apps = await org.apps()
  const votingApp = apps.find(app => app.appName === 'voting.aragonpm.eth')

  console.log('\nOrganization:', org.location, `(${org.address})`)

  if (!votingApp?.address) {
    console.log('\nNo voting app found in this organization')
    return
  }

  console.log(`\nVoting app: ${votingApp.address}`)

  const voting = new Voting(votingApp.address, ALL_VOTING_SUBGRAPH_URL)

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
