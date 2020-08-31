import { connect, Permission, Organization } from '@aragon/connect'
import { keepRunning } from './helpers'

const ORG_ADDRESS = '0xd697d1f417c621a6a54d9a7fa2805596ca393222'

async function main() {
  const org = (await connect(ORG_ADDRESS, 'thegraph', {
    network: 4,
  })) as Organization

  const subscription = org.onPermissions(
    (error: Error | null, permissions?: Permission[]) => {
      if (error) {
        console.error(error)
        return
      }
      for (const permission of permissions as Permission[]) {
        console.log(permission)
      }
      console.log(
        `\nTry creating or granting new permissions at https://rinkeby.aragon.org/#/${ORG_ADDRESS}/permissions/`
      )
    }
  )

  await keepRunning()

  // Simply to illustrate how to close a subscription
  subscription.unsubscribe()
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
