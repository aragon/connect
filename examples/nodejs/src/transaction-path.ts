import { connect } from '@1hive/connect'

const NETWORK = 100
const DAO = '0x2050eabe84409e480ad1062001fdb6dfbc836192'
const ACCOUNT = '0x4355a2cdec902C372F404007114bbCf2C65A3eb0'

async function main() {
  const org = await connect(DAO, 'thegraph', {
    network: NETWORK,
    actAs: ACCOUNT,
  })

  const tokenManager = await org.app('wrappable-hooked-token-manager')

  // Transaction intent
  const intent = await tokenManager.intent('wrap', ['50000000000000000000'])

  // Transaction path
  // const txPath = intent.path

  // Transaction request
  intent.transactions.map((tx: any) => console.log(tx))
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
