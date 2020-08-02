import { Agreement, AgreementConnectorTheGraph } from '../../../src'

const AGREEMENT_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/facuspagnuolo/aragon-agreement-rinkeby-staging'
const AGREEMENT_APP_ADDRESS = '0x40bb5003d24a0f58da03b19287e20ce2a3db9b54'

describe('Agreement', () => {
  let agreement: Agreement

  beforeAll(() => {
    const connector = new AgreementConnectorTheGraph(AGREEMENT_SUBGRAPH_URL)
    agreement = new Agreement(connector, AGREEMENT_APP_ADDRESS)
  })

  afterAll(async () => {
    await agreement.connector.disconnect()
  })

  describe('data', () => {
    test('has an address', async () => {
      expect(agreement.address).toBe(AGREEMENT_APP_ADDRESS)
    })

    test('has a staking factory', async () => {
      expect(await agreement.stakingFactory()).toBe('0x07429001eea415e967c57b8d43484233d57f8b0b')
    })

    test('belongs to a DAO', async () => {
      expect(await agreement.dao()).toBe('0xa6e4b08981ae324f16d6be39362f6de2da22882a')
    })
  })

  describe('versions', () => {
    test('has a current version', async () => {
      const version = await agreement.currentVersion()

      expect(version.id).toBe(`${AGREEMENT_APP_ADDRESS}-version-3`)
      expect(version.versionId).toBe("3")
      expect(version.title).toBe("Agreement Test v3")
      expect(version.content).toEqual('0x697066733a516d644c7533585854397555597871444b5858735459473737714e594e5062687a4c32375a5954396b457271635a')
      expect(version.arbitrator).toBe('0x52180af656a1923024d1accf1d827ab85ce48878')
      expect(version.appFeesCashier).toBe('0x0000000000000000000000000000000000000000')
      expect(version.effectiveFrom).toBe('1596201178')
    })

    test('allows querying a particular version', async () => {
      const version = await agreement.version('2')

      expect(version.id).toBe(`${AGREEMENT_APP_ADDRESS}-version-2`)
      expect(version.versionId).toBe("2")
      expect(version.title).toBe("Agreement Test")
      expect(version.content).toEqual('0x697066733a516d644c7533585854397555597871444b5858735459473737714e594e5062687a4c32375a5954396b457271635a')
      expect(version.arbitrator).toBe('0x52180af656a1923024d1accf1d827ab85ce48878')
      expect(version.appFeesCashier).toBe('0xa52fd5bf794c1e8b44ee7db7f277ad31c1c8afb4')
      expect(version.effectiveFrom).toBe('1596198238')
    })

    test('allows fetching a list of versions', async () => {
      const versions = await agreement.versions()
      expect(versions.length).toBeGreaterThan(2)

      const version = versions[0]
      expect(version.title).toBe("Agreement Test")
      expect(version.content).toEqual('0x697066733a516d644c7533585854397555597871444b5858735459473737714e594e5062687a4c32375a5954396b457271635a')
      expect(version.arbitrator).toBe('0x28d0807903c5591c570173502d8507a65be64edb')
      expect(version.appFeesCashier).toBe('0xa52fd5bf794c1e8b44ee7db7f277ad31c1c8afb4')
      expect(version.effectiveFrom).toBe('1596140953')
    })
  })
})
