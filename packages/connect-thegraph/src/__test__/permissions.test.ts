import { connect } from '@aragon/connect'
import { Organization, Permission } from '@aragon/connect-core'
import { isAddress, isBytes32 } from '../../../test-helpers'

const ORG_LOCATION = 'piedao.aragonid.eth'

const MAINNET_NETWORK = 1

describe('when connecting to the mainnet subgraph', () => {
  let org: Organization

  beforeAll(async () => {
    org = await connect(ORG_LOCATION, 'thegraph', { network: MAINNET_NETWORK })
  })

  afterAll(async () => {
    await org.connection.orgConnector.disconnect?.()
  })

  describe('when querying for the permissions of an org', () => {
    let permissions: Permission[]

    beforeAll(async () => {
      permissions = await org.permissions()
    })

    test('permissions are found', () => {
      expect(permissions.length).toBeGreaterThan(0)
    })

    describe('when looking at a permission', () => {
      let permission: Permission

      beforeAll(() => {
        permission = permissions[Math.floor(permissions.length / 2)]
      })

      test('has a valid app address', () => {
        expect(isAddress(permission.appAddress)).toBeTruthy()
      })

      test('has a valid grantee address', () => {
        expect(isAddress(permission.granteeAddress)).toBeTruthy()
      })

      test('has a valid role hash', () => {
        expect(isBytes32(permission.roleHash)).toBeTruthy()
      })
    })
  })
})
