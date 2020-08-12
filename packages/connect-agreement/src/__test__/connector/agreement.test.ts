import { AgreementData } from '../../types'
import { AgreementConnectorTheGraph } from '../../../src'

const AGREEMENT_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/facuspagnuolo/aragon-agreement-rinkeby-staging'
const AGREEMENT_APP_ADDRESS = '0x40bb5003d24a0f58da03b19287e20ce2a3db9b54'

describe('Agreement', () => {
  let connector: AgreementConnectorTheGraph

  beforeAll(() => {
    connector = new AgreementConnectorTheGraph(AGREEMENT_SUBGRAPH_URL)
  })

  afterAll(async () => {
    await connector.disconnect()
  })

  describe('data', () => {
    let agreement: AgreementData

    beforeAll(async () => {
      agreement = await connector.agreement(AGREEMENT_APP_ADDRESS)
    })

    test('returns the agreement data', () => {
      expect(agreement.id).toBe(AGREEMENT_APP_ADDRESS)
      expect(agreement.dao).toBe('0xa6e4b08981ae324f16d6be39362f6de2da22882a')
      expect(agreement.stakingFactory).toBe(
        '0x07429001eea415e967c57b8d43484233d57f8b0b'
      )
      expect(agreement.currentVersionId).toBe(
        `${AGREEMENT_APP_ADDRESS}-version-3`
      )
    })
  })
})
