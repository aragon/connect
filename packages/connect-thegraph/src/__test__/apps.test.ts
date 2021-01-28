import { connect } from '@aragon/connect'
import { App, Organization } from '@aragon/connect-core'
import ConnectorTheGraph from '../connector'
import { isAddress, isBytes32 } from '../../../test-helpers'

const ORG_NAME = 'piedao.aragonid.eth'
const APP_ADDRESS = '0xbce807b35dee2fbe457e4588f1c799879446eb54'

const MAINNET_NETWORK = 1

describe('when connecting to the mainnet subgraph', () => {
  let org: Organization
  let app: App

  beforeAll(async () => {
    org = await connect(ORG_NAME, 'thegraph', { network: MAINNET_NETWORK })
  })

  afterAll(async () => {
    await org.connection.orgConnector.disconnect?.()
  })

  function isValidApp(): void {
    test('should have a valid abi', () => {
      expect(app.abi).toBeDefined()
      expect(app.abi!.length).toBeGreaterThan(0)
    })
    test('should have a valid address', () => {
      expect(isAddress(app.address)).toBeTruthy()
    })
    test('should have a valid app id', () => {
      expect(isBytes32(app.appId)).toBeTruthy()
    })

    test('should have a valid appName', () => {
      expect(app.artifact.appName).toBeDefined()
      expect(app.artifact.appName!.length).toBeGreaterThan(0)
    })

    test('should have a valid artifact', () => {
      expect(app.artifact).toBeDefined()
    })

    test('should have a valid code address', () => {
      expect(isAddress(app.codeAddress)).toBeTruthy()
    })

    test('should have a valid content uri', () => {
      expect(app.contentUri).toBeDefined()
      expect(app.contentUri!.length).toBeGreaterThan(0)
    })

    test('should have valid methods', () => {
      expect(app.artifact.functions).toBeDefined()
      expect(app.artifact.functions!.length).toBeGreaterThan(0)
    })
    test('should have valid isForwarder', () => {
      expect(app.isForwarder).toBeDefined()
    })
    test('should have valid isUpgradeable', () => {
      expect(app.isUpgradeable).toBeDefined()
    })

    test('should have a valid kernel address', () => {
      expect(isAddress(app.kernelAddress)).toBeTruthy()
    })

    test('should have a valid manifest', () => {
      expect(app.manifest).toBeDefined()
    })

    test('should have a valid name', () => {
      expect(app.name).toBeDefined()
      expect(app.name!.length).toBeGreaterThan(0)
    })

    test('should have a valid registry address', () => {
      expect(app.registryAddress).toBeDefined()
      expect(isAddress(app.registryAddress)).toBeTruthy()
    })

    test('should have a valid repo address', () => {
      expect(app.repoAddress).toBeDefined()
      expect(isAddress(app.repoAddress!)).toBeTruthy()
    })

    test('should have a valid version', () => {
      expect(app.version).toBeDefined()
      expect(app.version!.length).toBeGreaterThan(0)
    })
  }

  describe('when querying for a specific app', () => {
    beforeAll(async () => {
      app = await org.connection.orgConnector.appByAddress(org, APP_ADDRESS)
    })

    isValidApp()
  })

  describe('when querying for the apps of an org', () => {
    let apps: App[]

    beforeAll(async () => {
      apps = await org.connection.orgConnector.appsForOrg(org, {})
    })

    test('apps are found', () => {
      expect(apps.length).toBeGreaterThan(0)
    })

    describe('when looking at an app', () => {
      beforeAll(() => {
        app = apps[10]
      })

      isValidApp()
    })
  })
})
