import ConnectorTheGraph from '../connector'
import { Role } from '@aragon/connect-core'
import { isAddress, isBytes32 } from '../../../test-helpers'

const APP_ADDRESS = '0xbce807b35dee2fbe457e4588f1c799879446eb54'

const MAINNET_NETWORK = {
  chainId: 1,
  name: 'homestead',
}

// TODO: Test subscriptions

describe('when connecting to the mainnet subgraph', () => {
  let connector: ConnectorTheGraph

  beforeAll(() => {
    connector = new ConnectorTheGraph(MAINNET_NETWORK)
  })

  describe('when querying the roles associated with an app', () => {
    let roles: Role[]

    beforeAll(async () => {
      roles = await connector.rolesForAddress(APP_ADDRESS)
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
        expect(role.permissions!.length).toBeGreaterThan(0)
      })

      test('should have a valid app address', () => {
        expect(isAddress(role.appAddress)).toBeTruthy()
      })

      test('should have a valid manager', () => {
        expect(role.permissions).toBeDefined()
        expect(isAddress(role.manager!)).toBeTruthy()
      })

      test('has a valid hash', () => {
        expect(isBytes32(role.hash)).toBeTruthy()
      })
    })
  })
})
