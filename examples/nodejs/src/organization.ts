import { connect, App, Organization } from '@aragon/connect'

const ORG_ADDRESS = '0x0c188b183ff758500d1d18b432313d10e9f6b8a4'

async function main() {
  const org = (await connect(ORG_ADDRESS, 'thegraph')) as Organization

  console.log('\nPermissions:')
  const permissions = await org.permissions()
  permissions.map(console.log)

  console.log('\nA role from a permission:')
  const role = await permissions[4].role()
  console.log(role)

  console.log('\nApps:')
  const apps = await org.apps()
  apps.map(console.log)

  console.log('\nA voting app:')
  const votingApp = apps.find((app: App) => app.name == 'dandelion-voting')!
  console.log(votingApp)

  console.log('\nRoles of an app:')
  const roles = await votingApp.roles()
  roles.map(console.log)

  console.log('\nA repo from an app:')
  const repo = await apps[2].repo()
  console.log(repo)

  console.log('\nAn app by address:')
  const appByAddress = await org.app(apps[1].address)
  console.log(appByAddress)

  console.log('\nAn app from a permission:')
  const appFromPermission = await permissions[1].app()
  console.log(appFromPermission)
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
