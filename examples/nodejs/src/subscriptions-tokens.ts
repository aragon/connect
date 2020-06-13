import { TokenManager, TokenHolder } from '@aragon/connect-thegraph-token-manager'
import { keepRunning } from './helpers'

const TOKENS_APP_ADDRESS = '0xb27004bf714ce2aa38f14647b38836f26df86cbf'
const ALL_TOKEN_MANAGER_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/aragon/aragon-tokens-mainnet'

async function main() {
  const tokenManager = new TokenManager(
    TOKENS_APP_ADDRESS,
    ALL_TOKEN_MANAGER_SUBGRAPH_URL
  )

  const token = await tokenManager.token()
  console.log(token)

  const subscription = token.onHolders((holders: TokenHolder[]) => {
    console.log(`\nHolders:`)
    holders.map(console.log)
  })

  await keepRunning()

  // Simply to illustrate how to close a subscription
  subscription.unsubscribe()
}


main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(`Error: `, err)
    console.log('\nPlease report any problem to https://github.com/aragon/connect/issues')
    process.exit(1)
  })
