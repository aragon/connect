import gql from 'graphql-tag'
import { GraphQLWrapper } from '@aragon/connect-thegraph'

const VOTING_APP_ADDRESS = '0xc73e86aab9d232495399d62fc80a36ae52952b81'
const ALL_VOTING_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/aragon/aragon-voting-rinkeby'

async function main() {
  console.log('\nLow-level inspection of a voting app:')
  const wrapper = new GraphQLWrapper(ALL_VOTING_SUBGRAPH_URL)

  const results = await wrapper.performQuery(gql`
    query {
      votes(where:{
        appAddress: "${VOTING_APP_ADDRESS}"
      }) {
        id
        metadata
        creator
      }
    }
  `)

  console.log(JSON.stringify(results.data, null, 2))
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(`err`, err)
    process.exit(1)
  })
