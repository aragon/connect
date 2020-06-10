import { TokenManager, TokenHolder } from '@aragon/connect-thegraph-token-manager'

const TOKENS_APP_ADDRESS = '0xb5146c785a64fefc17bcbae1f07ad0000e300442'
const ALL_TOKEN_MANAGER_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/aragon/aragon-tokens-rinkeby-staging'

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
