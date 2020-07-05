import ConnectorTheGraph from '../connector'
import { App } from '@aragon/connect-core'
import { isAddress, isBytes32 } from '../../../test-helpers'

const ORG_ADDRESS = '0x0c188b183ff758500d1d18b432313d10e9f6b8a4'
const APP_ADDRESS = '0xbce807b35dee2fbe457e4588f1c799879446eb54'

const MAINNET_NETWORK = {
  chainId: 1,
  name: 'homestead',
}

describe('when connecting to the mainnet subgraph', () => {
  let app: App
  let connector: ConnectorTheGraph

  beforeAll(() => {
    connector = new ConnectorTheGraph(MAINNET_NETWORK)
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
      expect(app.appName).toBeDefined()
      expect(app.appName!.length).toBeGreaterThan(0)
    })

    test('should have a valid author', () => {
      expect(app.author).toBeDefined()
      expect(app.author!.length).toBeGreaterThan(0)
    })

    test('should have a valid code address', () => {
      expect(isAddress(app.codeAddress)).toBeTruthy()
    })

    test('should have a valid content uri', () => {
      expect(app.contentUri).toBeDefined()
      expect(app.contentUri!.length).toBeGreaterThan(0)
    })

    test('should have a contract path', () => {
      expect(app.contractPath).toBeDefined()
      expect(app.contractPath!.length).toBeGreaterThan(0)
    })

    test('should have a valid description', () => {
      expect(app.description).toBeDefined()
      expect(app.description!.length).toBeGreaterThan(0)
    })

    test('should have valid intents', () => {
      expect(app.intents).toBeDefined()
      expect(app.intents!.length).toBeGreaterThan(0)
    })

    test('should have valid icons', () => {
      expect(app.icons).toBeDefined()
      expect(app.icons!.length).toBeGreaterThan(0)
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

    test('should have a valid name', () => {
      expect(app.name).toBeDefined()
      expect(app.name!.length).toBeGreaterThan(0)
    })
    test('should have a valid registry address', () => {
      expect(isAddress(app.registryAddress)).toBeTruthy()
    })

    test('should have a valid repo address', () => {
      expect(app.repoAddress).toBeDefined()
      expect(isAddress(app.repoAddress!)).toBeTruthy()
    })

    test('should have a valid source url', () => {
      expect(app.sourceUrl).toBeDefined()
      expect(app.sourceUrl!.length).toBeGreaterThan(0)
    })

    test('should have a valid version', () => {
      expect(app.version).toBeDefined()
      expect(app.version!.length).toBeGreaterThan(0)
    })
  }

  describe('when querying for a specific app', () => {
    beforeAll(async () => {
      app = await connector.appByAddress(APP_ADDRESS)
    })

    isValidApp()
  })

  describe('when querying for the apps of an org', () => {
    let apps: App[]

    beforeAll(async () => {
      apps = await connector.appsForOrg(ORG_ADDRESS, {})
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
