import { connect, Permission, App, Role, Organization } from '@aragon/connect'

const DAO_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/aragon/aragon-rinkeby'
const ORG_ADDRESS = '0x059bCFBC477C46AB39D76c05B7b40f3A42e7DE3B'

async function main() {
  const org = (await connect(
    ORG_ADDRESS,
    ['thegraph', { daoSubgraphUrl: DAO_SUBGRAPH_URL }]
  )) as Organization

  const subscription = org.onPermissions((permissions: Permission[]) => {
    permissions.map(console.log)
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
