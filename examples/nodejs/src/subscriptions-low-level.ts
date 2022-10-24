import gql from 'graphql-tag'
import { GraphQLWrapper } from '@aragon/connect-thegraph'
import { keepRunning } from './helpers'

const DAO_ADDRESS = '0x059bcfbc477c46ab39d76c05b7b40f3a42e7de3b'
const VOTING_APP_ADDRESS = '0x0cf8fe5c21fd283e66c1d42bbe0b2e64fb30295d'
const ALL_VOTING_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-voting-goerli'

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
          originalCreator
        }
      }
    `,
    {},
    (error: Error | null, results?: any) => {
      if (error) {
        console.error(error)
        return
      }
      console.log(JSON.stringify(results.data, null, 2))
    }
  )

  // At this point, creating a vote in the organization will trigger new output.
  await keepRunning()

  // Simply to illustrate how to close a subscription
  subscription.unsubscribe()
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
