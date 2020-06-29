import { ethers } from 'ethers'
import { connect, Application, Organization } from '@aragon/connect'

const network = 'mainnet'

const ORG_ADDRESS = '0x0c188b183ff758500d1d18b432313d10e9f6b8a4'
const ACCOUNT = '0xf76604Ce7e7F0134a5310bCfc9C34cAEddf15873'

async function main() {
  const readProvider = ethers.getDefaultProvider(network)

  const org = (await connect(ORG_ADDRESS, 'thegraph', {
    readProvider,
  })) as Organization

  const apps = await org.apps()
  const finance = apps.find((app: Application) => app.name == 'finance')!

  const intent = org.appIntent(finance.address, 'newImmediatePayment', [
    ethers.constants.AddressZero,
    ACCOUNT,
    ethers.utils.parseEther('1'),
    'Tests Payment',
  ])

  const txPath = await intent.paths(ACCOUNT)

  console.log('\nTransactions on the path:')
  txPath.transactions.map((tx: any) => console.log(tx))
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.log(`Error: `, err)
    console.log(
      '\nPlease report any problem to https://github.com/aragon/connect/issues'
    )
    process.exit(1)
  })
