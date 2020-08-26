import { AgreementConnectorTheGraph, Version } from '../../../src'

const AGREEMENT_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-agreement-rinkeby-staging'
const AGREEMENT_APP_ADDRESS = '0x9c92dbd8a8e5903e2741202321073091109f26be'

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
      expect(version.title).toBe('Aragon Network Cash Agreement')
      expect(version.content).toEqual(
        '0x697066733a516d50766657554e743357725a37756142315a77456d6563335a723141424c39436e63534466517970576b6d6e70'
      )
      expect(version.arbitrator).toBe(
        '0x52180af656a1923024d1accf1d827ab85ce48878'
      )
      expect(version.appFeesCashier).toBe(
        '0x0000000000000000000000000000000000000000'
      )
      expect(version.effectiveFrom).toBe('1598475758')
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
      expect(version.title).toBe('Aragon Network Cash Agreement')
      expect(version.content).toEqual(
        '0x697066733a516d50766657554e743357725a37756142315a77456d6563335a723141424c39436e63534466517970576b6d6e70'
      )
      expect(version.arbitrator).toBe(
        '0x52180af656a1923024d1accf1d827ab85ce48878'
      )
      expect(version.appFeesCashier).toBe(
        '0x0000000000000000000000000000000000000000'
      )
      expect(version.effectiveFrom).toBe('1598475758')
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

      expect(version.title).toBe('Aragon Network Cash Agreement')
      expect(version.content).toEqual(
        '0x697066733a516d50766657554e743357725a37756142315a77456d6563335a723141424c39436e63534466517970576b6d6e70'
      )
      expect(version.arbitrator).toBe(
        '0x52180af656a1923024d1accf1d827ab85ce48878'
      )
      expect(version.appFeesCashier).toBe(
        '0x0000000000000000000000000000000000000000'
      )
      expect(version.effectiveFrom).toBe('1598475758')
    })
  })
})
