import { connect } from '@aragon/connect'
import { Organization, Role } from '@aragon/connect-core'
import { isAddress, isBytes32 } from '../../../test-helpers'

const ORG_LOCATION = 'piedao.aragonid.eth'
const APP_ADDRESS = '0xbce807b35dee2fbe457e4588f1c799879446eb54'

const MAINNET_NETWORK = 1

describe('when connecting to the mainnet subgraph', () => {
  let org: Organization

  beforeAll(async () => {
    org = await connect(ORG_LOCATION, 'thegraph', { network: MAINNET_NETWORK })
  })

  afterAll(async () => {
    await org.connection.orgConnector.disconnect?.()
  })

  describe('when querying the roles associated with an app', () => {
    let roles: Role[]

    beforeAll(async () => {
      roles = await org.connection.orgConnector.rolesForAddress(
        org,
        APP_ADDRESS
      )
    })

    test('roles are found', () => {
      expect(roles.length).toBeGreaterThan(0)
    })

    describe('when looking at a role', () => {
      let role: Role

      beforeAll(() => {
        role = roles[roles.length - 1]
      })

      test('should have a valid name', () => {
        expect(role.name).toBeDefined()
        expect(role.name!.length).toBeGreaterThan(0)
      })

      test('should have a valid description', () => {
        expect(role.description).toBeDefined()
        expect(role.description!.length).toBeGreaterThan(0)
      })

      test('should have valid permissions', () => {
        expect(role.permissions).toBeDefined()
        expect(role.permissions?.length || 0).toBeGreaterThan(0)
      })

      test('should have a valid app address', () => {
        expect(isAddress(role.appAddress)).toBeTruthy()
      })

      test('should have a valid manager', () => {
        expect(role.permissions).toBeDefined()
        expect(isAddress(role.manager!)).toBeTruthy()
      })

      test('should have a valid name', () => {
        expect(role.name).toBeDefined()
        expect(role.name!.length).toBeGreaterThan(0)
      })

      test('has a valid hash', () => {
        expect(isBytes32(role.hash)).toBeTruthy()
      })
    })
  })
})
