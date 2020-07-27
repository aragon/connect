import { AgreementConnectorTheGraph, Version } from '../../src'

const AGREEMENT_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/facuspagnuolo/aragon-agreement-rinkeby-staging'
const AGREEMENT_APP_ADDRESS = '0x5c6620c49f9aecf74bd483054f2d0ace0d375f96'

describe('Agreement versions', () => {
  let connector: AgreementConnectorTheGraph

  beforeAll(() => {
    connector = new AgreementConnectorTheGraph(
      AGREEMENT_SUBGRAPH_URL
    )
  })

  afterAll(async () => {
    await connector.disconnect()
  })

  describe('current version', () => {
    let version: Version

    beforeAll(async () => {
      version = await connector.version('1', 1000, 0)
    })

    test('returns that version information', () => {
      expect(version.id).toBe(`${AGREEMENT_APP_ADDRESS}-version-1`)
      expect(version.versionId).toBe("1")
      expect(version.title).toBe("Test Agreement")
      expect(version.content).toEqual('0x697066733a516d6235434862515151783659586b504536486f646558566d744352677053676b6a39456b57397873366a44486a')
      expect(version.arbitrator).toBe('0x06a3fa06f9bfa8d945c367d183d1562bce0500db')
      expect(version.appFeesCashier).toBe('0x45c8e37ef5bb4c6681351282d7d0ceda58bb7eb0')
      expect(version.effectiveFrom).toBe('1594074954')
    })
  })

  describe('versions', () => {
    let versions: Version[]

    beforeAll(async () => {
      versions = await connector.versions(AGREEMENT_APP_ADDRESS, 1000, 0)
    })

    test('returns a list of versions', () => {
      expect(versions.length).toBeGreaterThan(0)
    })

    test('allows fetching a single version', () => {
      let version = versions[0]

      expect(version.title).toBe("Test Agreement")
      expect(version.content).toEqual('0x697066733a516d6235434862515151783659586b504536486f646558566d744352677053676b6a39456b57397873366a44486a')
      expect(version.arbitrator).toBe('0x06a3fa06f9bfa8d945c367d183d1562bce0500db')
      expect(version.appFeesCashier).toBe('0x45c8e37ef5bb4c6681351282d7d0ceda58bb7eb0')
      expect(version.effectiveFrom).toBe('1594074954')
    })
  })
})

