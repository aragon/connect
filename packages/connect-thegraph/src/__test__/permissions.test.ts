import ConnectorTheGraph from '../connector'
import {
  Permission
} from '@aragon/connect-core'
import {
  isAddress,
  isBytes32
} from '../../../test-helpers'

const DAO_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/aragon/aragon-mainnet'
const ORG_ADDRESS = '0x0c188b183ff758500d1d18b432313d10e9f6b8a4'

describe('when connecting to the mainnet subgraph', () => {
  let connector: ConnectorTheGraph

  beforeAll(() => {
    connector = new ConnectorTheGraph({
      daoSubgraphUrl: DAO_SUBGRAPH_URL
    })
  })

  describe('when querying for the permissions of an org', () => {
    let permissions: Permission[]

    beforeAll(async () => {
      permissions = await connector.permissionsForOrg(ORG_ADDRESS)
    })

    test('permissions are found', () => {
      expect(permissions.length).toBeGreaterThan(0)
    })

    describe('when looking at a permission', () => {
      let permission: Permission

      beforeAll(() => {
        permission = permissions[Math.floor(permissions.length / 2)]
        // console.log(permission)
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

