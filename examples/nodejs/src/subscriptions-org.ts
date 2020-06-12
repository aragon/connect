import { connect, Permission, Organization } from '@aragon/connect'
import { keepRunning } from './helpers'

const DAO_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/aragon/aragon-rinkeby'
const ORG_ADDRESS = '0xd697d1f417c621a6a54d9a7fa2805596ca393222'

async function main() {
  const org = (await connect(
    ORG_ADDRESS,
    ['thegraph', { daoSubgraphUrl: DAO_SUBGRAPH_URL }]
  )) as Organization

  const subscription = org.onPermissions((permissions: Permission[]) => {
    permissions.map(console.log)
    console.log(`\nTry creating or granting new permissions at https://rinkeby.aragon.org/#/${ORG_ADDRESS}/permissions/`)
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
