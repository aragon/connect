import { ethers } from 'ethers'
import { connect } from '@aragon/connect'

const ACCOUNT = '0xf76604Ce7e7F0134a5310bCfc9C34cAEddf15873'

async function main() {
  const org = await connect('piedao.aragonid.eth', 'thegraph')

  const finance = await org.app('finance')

  // Transaction intent
  const intent = org.appIntent(finance.address, 'newImmediatePayment', [
    ethers.constants.AddressZero,
    ACCOUNT,
    ethers.utils.parseEther('1'),
    'Tests Payment',
  ])

  // Transaction path
  const txPath = await intent.paths(ACCOUNT)

  // Transaction request
  txPath.transactions.map((tx: any) => console.log(tx))
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
