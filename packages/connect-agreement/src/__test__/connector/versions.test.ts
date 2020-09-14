import { AgreementConnectorTheGraph, Version } from '../../../src'

const AGREEMENT_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/facuspagnuolo/aragon-agreement-rinkeby-staging'
const AGREEMENT_APP_ADDRESS = '0xe4575381f0c96f58bd93be6978cc0d9638d874a2'

describe('Agreement versions', () => {
  let connector: AgreementConnectorTheGraph

  beforeAll(() => {
    connector = new AgreementConnectorTheGraph({
      subgraphUrl: AGREEMENT_SUBGRAPH_URL,
    })
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
      expect(version.id).toBe(`${AGREEMENT_APP_ADDRESS}-version-1`)
      expect(version.versionId).toBe('1')
      expect(version.title).toBe('Aragon Network DAO Agreement')
      expect(version.content).toEqual(
        '0x697066733a516d646159544a6b36615632706d56527839456456386b64447844397947466b7464366846736b585372344b4445'
      )
      expect(version.arbitrator).toBe(
        '0x52180af656a1923024d1accf1d827ab85ce48878'
      )
      expect(version.appFeesCashier).toBe(
        '0x0000000000000000000000000000000000000000'
      )
      expect(version.effectiveFrom).toBe('1599860871')
    })
  })

  describe('version', () => {
    let version: Version

    beforeAll(async () => {
      version = await connector.version(`${AGREEMENT_APP_ADDRESS}-version-1`)
    })

    test('returns the requested version information', () => {
      expect(version.id).toBe(`${AGREEMENT_APP_ADDRESS}-version-1`)
      expect(version.versionId).toBe('1')
      expect(version.title).toBe('Aragon Network DAO Agreement')
      expect(version.content).toEqual(
        '0x697066733a516d646159544a6b36615632706d56527839456456386b64447844397947466b7464366846736b585372344b4445'
      )
      expect(version.arbitrator).toBe(
        '0x52180af656a1923024d1accf1d827ab85ce48878'
      )
      expect(version.appFeesCashier).toBe(
        '0x0000000000000000000000000000000000000000'
      )
      expect(version.effectiveFrom).toBe('1599860871')
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

      expect(version.title).toBe('Aragon Network DAO Agreement')
      expect(version.content).toEqual(
        '0x697066733a516d646159544a6b36615632706d56527839456456386b64447844397947466b7464366846736b585372344b4445'
      )
      expect(version.arbitrator).toBe(
        '0x52180af656a1923024d1accf1d827ab85ce48878'
      )
      expect(version.appFeesCashier).toBe(
        '0x0000000000000000000000000000000000000000'
      )
      expect(version.effectiveFrom).toBe('1599860871')
    })
  })
})
