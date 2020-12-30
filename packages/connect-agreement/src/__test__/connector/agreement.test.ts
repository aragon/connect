import { AgreementData } from '../../types'
import { AgreementConnectorTheGraph } from '../../../src'

const AGREEMENT_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/facuspagnuolo/aragon-agreement-rinkeby-staging'
const AGREEMENT_APP_ADDRESS = '0xe4575381f0c96f58bd93be6978cc0d9638d874a2'

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
      expect(agreement.dao).toBe('0xe990dd6a81c0fdaad6b5cef44676b383350ad94e')
      expect(agreement.stakingFactory).toBe(
        '0x6a30c2de7359db110b6322b41038674ae1d276fb'
      )
      expect(agreement.currentVersionId).toBe(
        `${AGREEMENT_APP_ADDRESS}-version-1`
      )
    })
  })
})
