import { AgreementData } from '../../types'
import { AgreementConnectorTheGraph } from '../../../src'

const AGREEMENT_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-agreement-rinkeby-staging'
const AGREEMENT_APP_ADDRESS = '0x9c92dbd8a8e5903e2741202321073091109f26be'

describe('Agreement', () => {
  let connector: AgreementConnectorTheGraph

  beforeAll(() => {
    connector = new AgreementConnectorTheGraph({
      subgraphUrl: AGREEMENT_SUBGRAPH_URL,
    })
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
      expect(agreement.dao).toBe('0x51a41e43af0774565f0be5cebc50c693cc19e4ee')
      expect(agreement.stakingFactory).toBe(
        '0x07429001eea415e967c57b8d43484233d57f8b0b'
      )
      expect(agreement.currentVersionId).toBe(
        `${AGREEMENT_APP_ADDRESS}-version-1`
      )
    })
  })
})
