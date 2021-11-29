import { connect } from '@1hive/connect'

const ORG_ADDRESS = '0x2ec8db0b2f2ed44b75c481b864f9dd1c611699c0'
const NETWORK = 100

async function main() {
  const org = await connect(ORG_ADDRESS, 'thegraph', { network: NETWORK })

  const script =
    '0x00000001a377585abed3e943e58174b55558a2482894ce2000000064beabacc80000000000000000000000003a97704a1b25f08aa230ae53b352e2e72ef528430000000000000000000000006626528de0c75ccc7a0d24f2d24b99060f74edee00000000000000000000000000000000000000000000001b1ae4d6e2ef500000'

  const description = await org.describeScript(script)

  console.log(description)
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
