import { connect, Permission, App, Role, Organization } from '@aragon/connect'

const DAO_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-mainnet-staging'
const ORG_ADDRESS = '0x0c188b183ff758500d1d18b432313d10e9f6b8a4'

async function main() {
  const org = (await connect(
    ORG_ADDRESS,
    ['thegraph', { daoSubgraphUrl: DAO_SUBGRAPH_URL }]
  )) as Organization

  console.log('\nPermissions:')
  const permissions = await org.permissions()
  permissions.map((permission: Permission) =>
    console.log(permission.toString())
  )

  console.log('\nA role from a permission:')
  const role = await permissions[4].getRole()
  console.log(role?.toString())

  console.log('\nApps:')
  const apps = await org.apps()
  apps.map((app: App) => {
    console.log(app.toString())
  })

  console.log('\nA voting app:')
  const votingApp = apps.find((app: App) => app.name == 'dandelion-voting')!
  console.log(votingApp.toString())

  console.log('\nRoles of an app:')
  const roles = await votingApp.roles()
  roles.map((role: Role) => {
    console.log(role.toString())
  })

  console.log('\nA repo from an app:')
  const repo = await apps[2].repo()
  console.log(repo.toString())

  console.log('\nAn app by address:')
  const appByAddress = await org.app(apps[1].address)
  console.log(appByAddress.toString())

  console.log('\nAn app from a permission:')
  const appFromPermission = await permissions[1].getApp()
  if (appFromPermission) {
    console.log(appFromPermission.toString())
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(`err`, err)
    process.exit(1)
  })
