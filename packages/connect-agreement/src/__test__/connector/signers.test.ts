import { AgreementConnectorTheGraph, Signer, Signature } from '../../../src'

const AGREEMENT_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/facuspagnuolo/aragon-agreement-rinkeby-staging'
const AGREEMENT_APP_ADDRESS = '0x40bb5003d24a0f58da03b19287e20ce2a3db9b54'
const SIGNER_ADDRESS = '0x0090aed150056316e37fe6dfa10dc63e79d173b6'

describe('Agreement signers', () => {
  let connector: AgreementConnectorTheGraph

  beforeAll(() => {
    connector = new AgreementConnectorTheGraph(AGREEMENT_SUBGRAPH_URL)
  })

  afterAll(async () => {
    await connector.disconnect()
  })

  describe('signer', () => {
    let signer: Signer

    beforeAll(async () => {
      signer = await connector.signer(`${AGREEMENT_APP_ADDRESS}-signer-${SIGNER_ADDRESS}`)
    })

    test('allows fetching signer information', async () => {
      expect(signer.id).toBe(`${AGREEMENT_APP_ADDRESS}-signer-${SIGNER_ADDRESS}`)
      expect(signer.address).toBe(SIGNER_ADDRESS)
      expect(signer.agreementId).toBe(AGREEMENT_APP_ADDRESS)
    })
  })

  describe('signatures', () => {
    let signatures: Signature[]

    beforeAll(async () => {
      signatures = await connector.signatures(`${AGREEMENT_APP_ADDRESS}-signer-${SIGNER_ADDRESS}`, 1000, 0)
    })

    test('allows fetching signer information', async () => {
      expect(signatures.length).toBeGreaterThan(1)

      const lastSignature = signatures[signatures.length - 1]
      expect(lastSignature.signerId).toBe(`${AGREEMENT_APP_ADDRESS}-signer-${SIGNER_ADDRESS}`)
      expect(lastSignature.versionId).toBe(`${AGREEMENT_APP_ADDRESS}-version-3`)
      expect(lastSignature.createdAt).toBe('1596201298')
    })
  })
})
