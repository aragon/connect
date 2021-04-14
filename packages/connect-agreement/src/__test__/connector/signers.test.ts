import { AgreementConnectorTheGraph, Signer, Signature } from '../../../src'

const AGREEMENT_APP_ADDRESS = '0xe4575381f0c96f58bd93be6978cc0d9638d874a2'
const AGREEMENT_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/facuspagnuolo/aragon-agreement-rinkeby-staging'

describe('Agreement signers', () => {
  const SIGNER_ADDRESS = '0x0090aed150056316e37fe6dfa10dc63e79d173b6'
  const SIGNER_ID = `${AGREEMENT_APP_ADDRESS}-signer-${SIGNER_ADDRESS}`

  let connector: AgreementConnectorTheGraph

  beforeAll(() => {
    connector = new AgreementConnectorTheGraph({
      subgraphUrl: AGREEMENT_SUBGRAPH_URL,
    })
  })

  afterAll(async () => {
    await connector.disconnect()
  })

  describe('signer', () => {
    let signer: Signer

    beforeAll(async () => {
      signer = (await connector.signer(SIGNER_ID))!
    })

    test('allows fetching signer information', async () => {
      expect(signer.id).toBe(SIGNER_ID)
      expect(signer.address).toBe(SIGNER_ADDRESS)
      expect(signer.agreementId).toBe(AGREEMENT_APP_ADDRESS)
    })
  })

  describe('signatures', () => {
    let signatures: Signature[]

    beforeAll(async () => {
      signatures = await connector.signatures(SIGNER_ID, 1000, 0)
    })

    test('allows fetching signer information', async () => {
      expect(signatures.length).toBeGreaterThan(0)

      const lastSignature = signatures[signatures.length - 1]
      expect(lastSignature.signerId).toBe(SIGNER_ID)
      expect(lastSignature.versionId).toBe(`${AGREEMENT_APP_ADDRESS}-version-1`)
      expect(lastSignature.createdAt).toBe('1599861231')
    })
  })
})
