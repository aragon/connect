import connect from '@aragon/connect'
import connectTokens from '@aragon/connect-tokens'

const ORG_ADDRESS = '0x7318f8bc0a9f0044d5c77a6aca9c73c1da49c51e'
const TOKENS_APP_ADDRESS = '0xb27004bf714ce2aa38f14647b38836f26df86cbf'

async function main() {
  const org = await connect(ORG_ADDRESS, 'thegraph', { verbose: true })
  const tokens = await connectTokens(org.app(TOKENS_APP_ADDRESS))

  const token = await tokens.token()
  console.log(token)

  console.log('\nHolders:')
  const holders = await tokens.holders()

  holders.map(console.log)
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
