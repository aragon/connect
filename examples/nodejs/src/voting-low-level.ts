import gql from 'graphql-tag'
import { GraphQLWrapper } from '@aragon/connect-thegraph'

const VOTING_APP_ADDRESS = '0x0cf8fe5c21fd283e66c1d42bbe0b2e64fb30295d'
const ALL_VOTING_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-voting-goerli'

const QUERY = `
query {
  votes(where:{
    appAddress: "${VOTING_APP_ADDRESS}"
  }) {
    id
    metadata
    creator
    originalCreator
  }
}
`

async function main() {
  console.log('\nLow-level inspection of a voting app:')
  const wrapper = new GraphQLWrapper(ALL_VOTING_SUBGRAPH_URL)
  const results = await wrapper.performQuery(gql(QUERY))

  console.log(JSON.stringify(results.data, null, 2))
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(`Error: `, err)
    console.log(
      '\nPlease report any problem to https://github.com/aragon/connect/issues'
    )
    process.exit(1)
  })
