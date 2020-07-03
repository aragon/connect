import { connect, describeScript, App } from '@aragon/connect'
import { Vote, Voting } from '@aragon/connect-thegraph-voting'

const VOTING_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-voting-mainnet'

function voteId(vote: Vote) {
  return (
    '#' +
    String(parseInt(vote.id.match(/voteId:(.+)$/)?.[1] || '0')).padEnd(2, ' ')
  )
}

async function main() {
  const org = await connect('beehive.aragonid.eth', 'thegraph')
  const apps = await org.apps()
  const votingApp = apps.find((app: App) => app.name === 'voting')!

  const voting = new Voting(votingApp.address, VOTING_SUBGRAPH_URL)

  const votes = await voting.votes()

  const { script } = votes.find(vote => voteId(vote) === '#54')!

  const description = await describeScript(script, apps)

  console.log('\nScript descriptions:')
  description.map((tx: any) => console.log(tx.description))
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
