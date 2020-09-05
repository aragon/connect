import { Agreement, Signer, AgreementConnectorTheGraph } from '../../../src'

const AGREEMENT_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-agreement-rinkeby-staging'
const AGREEMENT_APP_ADDRESS = '0x9c92dbd8a8e5903e2741202321073091109f26be'

describe('Agreement', () => {
  let agreement: Agreement

  beforeAll(() => {
    const connector = new AgreementConnectorTheGraph({
      subgraphUrl: AGREEMENT_SUBGRAPH_URL,
    })
    agreement = new Agreement(connector, AGREEMENT_APP_ADDRESS)
  })

  afterAll(async () => {
    await agreement.disconnect()
  })

  describe('data', () => {
    test('has an address', async () => {
      expect(await agreement.id()).toBe(AGREEMENT_APP_ADDRESS)
    })

    test('has a staking factory', async () => {
      expect(await agreement.stakingFactory()).toBe(
        '0x07429001eea415e967c57b8d43484233d57f8b0b'
      )
    })

    test('belongs to a DAO', async () => {
      expect(await agreement.dao()).toBe(
        '0x51a41e43af0774565f0be5cebc50c693cc19e4ee'
      )
    })
  })

  describe('versions', () => {
    test('has a current version', async () => {
      const version = await agreement.currentVersion()

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

    test('allows querying a particular version', async () => {
      const version = await agreement.version('1')

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

    test('allows fetching a list of versions', async () => {
      const versions = await agreement.versions()
      expect(versions.length).toBeGreaterThan(0)

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

  describe('disputableApps', () => {
    test('allows fetching a list of disputable apps', async () => {
      const disputables = await agreement.disputableApps()
      expect(disputables.length).toBeGreaterThan(0)

      const disputable = disputables[0]
      expect(disputable.id).toBe(
        `${AGREEMENT_APP_ADDRESS}-disputable-${disputable.address}`
      )
      expect(disputable.address).toBe(
        '0x0e835020497b2cd716369f8fc713fb7bd0a22dbf'
      )
      expect(disputable.activated).toEqual(true)
      expect(disputable.agreementId).toBe(AGREEMENT_APP_ADDRESS)
      expect(disputable.collateralRequirementId).toBe(
        `${AGREEMENT_APP_ADDRESS}-disputable-${disputable.address}-collateral-requirement-1`
      )

      const collateralRequirement = await disputable.collateralRequirement()
      expect(collateralRequirement.actionAmount).toEqual('0')
      expect(collateralRequirement.formattedActionAmount).toEqual('0.00')
      expect(collateralRequirement.challengeAmount).toBe('0')
      expect(collateralRequirement.formattedChallengeAmount).toBe('0.00')
      expect(collateralRequirement.challengeDuration).toBe('259200')

      const erc20 = await collateralRequirement.token()
      expect(erc20.decimals).toEqual(18)
      expect(erc20.name).toEqual('DAI Token')
      expect(erc20.symbol).toBe('DAI')
    })
  })

  describe('signers', () => {
    let signer: Signer
    const SIGNER_ADDRESS = '0x0090aed150056316e37fe6dfa10dc63e79d173b6'

    beforeAll(async () => {
      signer = await agreement.signer(SIGNER_ADDRESS)
    })

    test('allows querying a particular signer', async () => {
      expect(signer.id).toBe(
        `${AGREEMENT_APP_ADDRESS}-signer-${SIGNER_ADDRESS}`
      )
      expect(signer.address).toBe(SIGNER_ADDRESS)
      expect(signer.agreementId).toBe(AGREEMENT_APP_ADDRESS)
    })

    test('allows telling if a signer signed a version', async () => {
      expect(await signer.hasSigned('1')).toBe(true)
      expect(await signer.hasSigned('1000')).toBe(false)
    })

    test('allows fetching the signatures of the signer', async () => {
      const signatures = await signer.signatures()
      expect(signatures.length).toBeGreaterThan(0)

      const lastSignature = signatures[signatures.length - 1]
      expect(lastSignature.signerId).toBe(
        `${AGREEMENT_APP_ADDRESS}-signer-${SIGNER_ADDRESS}`
      )
      expect(lastSignature.versionId).toBe(`${AGREEMENT_APP_ADDRESS}-version-1`)
      expect(lastSignature.createdAt).toBe('1598479718')
    })
  })

  describe('staking', () => {
    const TOKEN = '0x3af6b2f907f0c55f279e0ed65751984e6cdc4a42'
    const USER = '0x0090aed150056316e37fe6dfa10dc63e79d173b6'

    test('allows fetching the staking information for a user and a token', async () => {
      const staking = await agreement.staking(TOKEN, USER)

      expect(staking.total).toBe('3000000000000000000')
      expect(staking.formattedTotalAmount).toBe('3.00')

      expect(staking.locked).toBe('3000000000000000000')
      expect(staking.formattedLockedAmount).toBe('3.00')

      expect(staking.available).toBe('0')
      expect(staking.formattedAvailableAmount).toBe('0.00')

      expect(staking.challenged).toBe('0')
      expect(staking.formattedChallengedAmount).toBe('0.00')
    })
  })

  describe('stakingMovements', () => {
    const TOKEN = '0x3af6b2f907f0c55f279e0ed65751984e6cdc4a42'
    const USER = '0x0090aed150056316e37fe6dfa10dc63e79d173b6'

    test('allows fetching the list of staking movements for a user', async () => {
      const movements = await agreement.stakingMovements(TOKEN, USER)
      expect(movements.length).toBeGreaterThan(5)

      expect(movements[0].formattedAmount).toBe('1.00')
      expect(movements[0].actionState).toBe('NA')
      expect(movements[0].collateralState).toBe('Available')

      expect(movements[1].formattedAmount).toBe('1.00')
      expect(movements[1].actionState).toBe('Scheduled')
      expect(movements[1].collateralState).toBe('Locked')
    })
  })
})
