import { TokenManager } from '@aragon/connect-thegraph-token-manager'

const TOKENS_APP_ADDRESS = '0x0021b622f112f6328886e8aa757a16952c94b130'
const ALL_TOKEN_MANAGER_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/ajsantander/aragon-token-mainnet'

async function main() {
  const tokenManager = new TokenManager(
    TOKENS_APP_ADDRESS,
    ALL_TOKEN_MANAGER_SUBGRAPH_URL
  )

  console.log(tokenManager.toString())

  console.log('\nToken:')
  const token = await tokenManager.token()
  console.log(token)

  console.log('\nHolders:')
  const holders = await token.holders()
  console.log(holders)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(`err`, err)
    process.exit(1)
  })
