import { TokenManager } from '@aragon/connect-thegraph-tokens'

const TOKENS_APP_ADDRESS = '0xb27004bf714ce2aa38f14647b38836f26df86cbf'
const ALL_TOKEN_MANAGER_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/aragon/aragon-tokens-mainnet'

async function main() {
  const tokenManager = new TokenManager(
    TOKENS_APP_ADDRESS,
    ALL_TOKEN_MANAGER_SUBGRAPH_URL, true
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
    console.log(`Error: `, err)
    console.log('\nPlease report any problem to https://github.com/aragon/connect/issues')
    process.exit(1)
  })
