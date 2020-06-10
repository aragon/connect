import gql from 'graphql-tag'
import { GraphQLWrapper } from '@aragon/connect-thegraph'

const VOTING_APP_ADDRESS = '0xc73e86aab9d232495399d62fc80a36ae52952b81'
const ALL_VOTING_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/ajsantander/aragon-voting-rinkeby'

async function main() {
  console.log('\nLow-level inspection of a voting app using subscriptions:')
  const wrapper = new GraphQLWrapper(ALL_VOTING_SUBGRAPH_URL)

  const subscription = wrapper.subscribeToQuery(
    gql`
      subscription {
        votes(where:{
          appAddress: "${VOTING_APP_ADDRESS}"
        }) {
          id
          metadata
          creator
        }
      }
    `,
    {},
    (results: any) => {
      console.log(JSON.stringify(results.data, null, 2))
    }
  )

  await keepRunning()

  // At this point, creating a vote in the organization will trigger new output.

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
