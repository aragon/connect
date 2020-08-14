import TokenAmount from 'token-amount'
import { connect } from '@aragon/connect'
import connectTokens from '@aragon/connect-tokens'

const BLUE = '\x1b[36m'
const RESET = '\x1b[0m'

const DECIMALS = 18

const env = {
  network: parseInt(process.env.CHAIN_ID ?? '1', 10),
  location: process.env.ORGANIZATION ?? 'piedao.aragonid.eth',
}

async function main() {
  const org = await connect(env.location, 'thegraph', { network: env.network })
  const tokens = await connectTokens(org.app('token-manager'))
  const token = await tokens.token()
  const holders = await tokens.holders()

  printOrganization(org)
  printBalances(holders, token.symbol)
}

function printOrganization(organization: any): void {
  console.log('')
  console.log(' Organization')
  console.log('')
  console.log('  Location:', BLUE + organization.location + RESET)
  console.log('  Address:', BLUE + organization.address + RESET)
  console.log('')
}

function printBalances(holders: any, tokenSymbol: string): void {
  console.log(` Balances (${holders.length})`)
  console.log('')
  for (const holder of holders) {
    console.log('  Account:', `${BLUE}${holder.address}${RESET}`)
    console.log(
      '  Balance:',
      `${BLUE}${TokenAmount.format(holder.balance, DECIMALS, {
        symbol: tokenSymbol,
      })}${RESET}`
    )
    console.log('')
  }
  console.log('')
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('')
    console.error(err)
    console.log(
      'Please report any problem to https://github.com/aragon/connect/issues'
    )
    process.exit(1)
  })
