import { AgreementConnectorTheGraph, Version } from '../../../src'

const AGREEMENT_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/facuspagnuolo/aragon-agreement-rinkeby-staging'
const AGREEMENT_APP_ADDRESS = '0x40bb5003d24a0f58da03b19287e20ce2a3db9b54'

describe('Agreement versions', () => {
  let connector: AgreementConnectorTheGraph

  beforeAll(() => {
    connector = new AgreementConnectorTheGraph(AGREEMENT_SUBGRAPH_URL)
  })

  afterAll(async () => {
    await connector.disconnect()
  })

  describe('current version', () => {
    let version: Version

    beforeAll(async () => {
      version = await connector.currentVersion(AGREEMENT_APP_ADDRESS)
    })

    test('returns the current version information', () => {
      expect(version.id).toBe(`${AGREEMENT_APP_ADDRESS}-version-3`)
      expect(version.versionId).toBe('3')
      expect(version.title).toBe('Agreement Test v3')
      expect(version.content).toEqual(
        '0x697066733a516d644c7533585854397555597871444b5858735459473737714e594e5062687a4c32375a5954396b457271635a'
      )
      expect(version.arbitrator).toBe(
        '0x52180af656a1923024d1accf1d827ab85ce48878'
      )
      expect(version.appFeesCashier).toBe(
        '0x0000000000000000000000000000000000000000'
      )
      expect(version.effectiveFrom).toBe('1596201178')
    })
  })

  describe('version', () => {
    let version: Version

    beforeAll(async () => {
      version = await connector.version(`${AGREEMENT_APP_ADDRESS}-version-2`)
    })

    test('returns the requested version information', () => {
      expect(version.id).toBe(`${AGREEMENT_APP_ADDRESS}-version-2`)
      expect(version.versionId).toBe('2')
      expect(version.title).toBe('Agreement Test')
      expect(version.content).toEqual(
        '0x697066733a516d644c7533585854397555597871444b5858735459473737714e594e5062687a4c32375a5954396b457271635a'
      )
      expect(version.arbitrator).toBe(
        '0x52180af656a1923024d1accf1d827ab85ce48878'
      )
      expect(version.appFeesCashier).toBe(
        '0xa52fd5bf794c1e8b44ee7db7f277ad31c1c8afb4'
      )
      expect(version.effectiveFrom).toBe('1596198238')
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
      const version = versions[0]

      expect(version.title).toBe('Agreement Test')
      expect(version.content).toEqual(
        '0x697066733a516d644c7533585854397555597871444b5858735459473737714e594e5062687a4c32375a5954396b457271635a'
      )
      expect(version.arbitrator).toBe(
        '0x28d0807903c5591c570173502d8507a65be64edb'
      )
      expect(version.appFeesCashier).toBe(
        '0xa52fd5bf794c1e8b44ee7db7f277ad31c1c8afb4'
      )
      expect(version.effectiveFrom).toBe('1596140953')
    })
  })
})
