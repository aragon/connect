import { TokenManager } from '@aragon/connect-thegraph-token-manager'

const TOKENS_APP_ADDRESS = '0xb5146c785a64fefc17bcbae1f07ad0000e300442'
const ALL_TOKEN_MANAGER_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/aragon/aragon-tokens-rinkeby'

async function main() {
  const tokenManager = new TokenManager(
    TOKENS_APP_ADDRESS,
    ALL_TOKEN_MANAGER_SUBGRAPH_URL
  )

  console.log(tokenManager)

  const token = await tokenManager.token()
  console.log(token)

  console.log('\nHolders:')
  const holders = await token.holders()
  holders.map(console.log)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(`err`, err)
    process.exit(1)
  })
