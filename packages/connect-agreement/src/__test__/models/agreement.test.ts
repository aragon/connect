import { ethers } from 'ethers'
import { connect } from '@aragon/connect'

import { bn } from '../../helpers'
import { Agreement, Signer, AgreementConnectorTheGraph } from '../../../src'

const RINKEBY_NETWORK = 4
const ORGANIZATION_NAME = '0x6322eb0294c6aadb7e1b37d41fd605a34df661dc'
const AGREEMENT_APP_ADDRESS = '0xe4575381f0c96f58bd93be6978cc0d9638d874a2'
const AGREEMENT_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/facuspagnuolo/aragon-agreement-rinkeby-staging'


describe('Agreement', () => {
  let agreement: Agreement

  beforeAll(async () => {
    const organization = await connect(ORGANIZATION_NAME, 'thegraph', { network: RINKEBY_NETWORK })
    const connector = new AgreementConnectorTheGraph({ subgraphUrl: AGREEMENT_SUBGRAPH_URL })
    const app = await organization.connection.orgConnector.appByAddress(organization, AGREEMENT_APP_ADDRESS)
    agreement = new Agreement(connector, app)
  })

  afterAll(async () => {
    await agreement.disconnect()
  })

  describe('data', () => {
    test('has an address', async () => {
      expect(await agreement.id()).toBe(AGREEMENT_APP_ADDRESS)
    })

    test('has a staking factory', async () => {
      expect(await agreement.stakingFactory()).toBe('0x6a30c2de7359db110b6322b41038674ae1d276fb')
    })

    test('belongs to a DAO', async () => {
      expect(await agreement.dao()).toBe('0xe990dd6a81c0fdaad6b5cef44676b383350ad94e')
    })
  })

  describe('versions', () => {
    test('has a current version', async () => {
      const version = await agreement.currentVersion()

      expect(version.id).toBe(`${AGREEMENT_APP_ADDRESS}-version-1`)
      expect(version.versionId).toBe('1')
      expect(version.title).toBe('Aragon Network DAO Agreement')
      expect(version.content).toEqual('0x697066733a516d646159544a6b36615632706d56527839456456386b64447844397947466b7464366846736b585372344b4445')
      expect(version.arbitrator).toBe('0x52180af656a1923024d1accf1d827ab85ce48878')
      expect(version.appFeesCashier).toBe('0x0000000000000000000000000000000000000000')
      expect(version.effectiveFrom).toBe('1599860871')
    })

    test('allows querying a particular version', async () => {
      const version = await agreement.version('1')

      expect(version.id).toBe(`${AGREEMENT_APP_ADDRESS}-version-1`)
      expect(version.versionId).toBe('1')
      expect(version.title).toBe('Aragon Network DAO Agreement')
      expect(version.content).toEqual('0x697066733a516d646159544a6b36615632706d56527839456456386b64447844397947466b7464366846736b585372344b4445')
      expect(version.arbitrator).toBe('0x52180af656a1923024d1accf1d827ab85ce48878')
      expect(version.appFeesCashier).toBe('0x0000000000000000000000000000000000000000')
      expect(version.effectiveFrom).toBe('1599860871')
    })

    test('allows fetching a list of versions', async () => {
      const versions = await agreement.versions()
      expect(versions.length).toBeGreaterThan(0)

      const version = versions[0]
      expect(version.title).toBe('Aragon Network DAO Agreement')
      expect(version.content).toEqual('0x697066733a516d646159544a6b36615632706d56527839456456386b64447844397947466b7464366846736b585372344b4445')
      expect(version.arbitrator).toBe('0x52180af656a1923024d1accf1d827ab85ce48878')
      expect(version.appFeesCashier).toBe('0x0000000000000000000000000000000000000000')
      expect(version.effectiveFrom).toBe('1599860871')
    })
  })

  describe('disputableApps', () => {
    test('allows fetching a list of disputable apps', async () => {
      const disputables = await agreement.disputableApps()
      expect(disputables.length).toBeGreaterThan(0)

      const disputable = disputables[0]
      expect(disputable.id).toBe(`${AGREEMENT_APP_ADDRESS}-disputable-${disputable.address}`)
      expect(disputable.address).toBe('0xfae0084f0171fbebf86476b9ac962680c4aa1564')
      expect(disputable.activated).toEqual(true)
      expect(disputable.agreementId).toBe(AGREEMENT_APP_ADDRESS)
      expect(disputable.currentCollateralRequirementId).toBe(`${AGREEMENT_APP_ADDRESS}-disputable-${disputable.address}-collateral-requirement-1`)

      const collateralRequirement = await disputable.collateralRequirement()
      expect(collateralRequirement.actionAmount).toEqual('5000000000000000000')
      expect(collateralRequirement.formattedActionAmount).toEqual('5.00')
      expect(collateralRequirement.challengeAmount).toBe('10000000000000000000')
      expect(collateralRequirement.formattedChallengeAmount).toBe('10.00')
      expect(collateralRequirement.challengeDuration).toBe('300')

      const erc20 = await collateralRequirement.token()
      expect(erc20.decimals).toEqual(18)
      expect(erc20.name).toEqual('DAI Token')
      expect(erc20.symbol).toBe('DAI')
    })
  })

  describe('signers', () => {
    describe('when the signer has signed', () => {
      let signer: Signer
      const SIGNER_ADDRESS = '0x0090aed150056316e37fe6dfa10dc63e79d173b6'

      beforeAll(async () => {
        signer = (await agreement.signer(SIGNER_ADDRESS))!
      })

      test('allows querying a particular signer', async () => {
        expect(signer.id).toBe(`${AGREEMENT_APP_ADDRESS}-signer-${SIGNER_ADDRESS}`)
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
        expect(lastSignature.signerId).toBe(`${AGREEMENT_APP_ADDRESS}-signer-${SIGNER_ADDRESS}`)
        expect(lastSignature.versionId).toBe(`${AGREEMENT_APP_ADDRESS}-version-1`)
        expect(lastSignature.createdAt).toBe('1599861231')
      })
    })

    describe('when the signer has not signed', () => {
      const SIGNER_ADDRESS = '0x0000000000000000000000000000000000000000'

      test('returns null', async () => {
        const signer = await agreement.signer(SIGNER_ADDRESS)
        expect(signer).toBeNull()
      })
    })
  })

  describe('staking', () => {
    const TOKEN = '0x3af6b2f907f0c55f279e0ed65751984e6cdc4a42'
    const USER = '0x0090aed150056316e37fe6dfa10dc63e79d173b6'

    test('allows fetching the staking information for a user and a token', async () => {
      const staking = (await agreement.staking(TOKEN, USER))!

      expect(staking.total).toBe('20000000000000000015')
      expect(staking.formattedTotalAmount).toBe('20.00')

      expect(staking.locked).toBe('15000000000000000001')
      expect(staking.formattedLockedAmount).toBe('15.00')

      expect(staking.available).toBe('5000000000000000014')
      expect(staking.formattedAvailableAmount).toBe('5.00')

      expect(staking.challenged).toBe('0')
      expect(staking.formattedChallengedAmount).toBe('0.00')
    })

    test('allows accessing the token data', async () => {
      const staking = (await agreement.staking(TOKEN, USER))!
      const token = await staking.token()

      expect(token.id).toBe(TOKEN)
      expect(token.name).toBe('DAI Token')
      expect(token.symbol).toBe('DAI')
      expect(token.decimals).toBe(18)
    })
  })

  describe('stakingMovements', () => {
    const TOKEN = '0x3af6b2f907f0c55f279e0ed65751984e6cdc4a42'
    const USER = '0x0090aed150056316e37fe6dfa10dc63e79d173b6'

    test('allows fetching the list of staking movements for a user', async () => {
      const movements = await agreement.stakingMovements(TOKEN, USER)
      expect(movements.length).toBeGreaterThan(1)

      expect(movements[0].formattedAmount).toBe('5.00')
      expect(movements[0].actionState).toBe('Scheduled')
      expect(movements[0].collateralState).toBe('Locked')

      expect(movements[1].formattedAmount).toBe('5.00')
      expect(movements[1].actionState).toBe('Scheduled')
      expect(movements[1].collateralState).toBe('Locked')
    })

    test('has an agreement action', async () => {
      const movements = await agreement.stakingMovements(TOKEN, USER)
      const movement = movements[1]

      expect(movement.agreementId).toBe(AGREEMENT_APP_ADDRESS)
      expect(movement.actionId).toBe(`${AGREEMENT_APP_ADDRESS}-action-2`)
      expect(movement.disputableAddress).toBe('0xfae0084f0171fbebf86476b9ac962680c4aa1564')
      expect(movement.disputableActionId).toBe('1')

      const action = (await movement.action())!
      expect(action.context).toBe('0x736f6d652066756e6473')
    })
  })

  describe('sign', () => {
    const VERSION_NUMBER = '1'
    const SIGNER_ADDRESS = '0x0090aed150056316e37fe6dfa10dc63e79d173b6'

    test('returns a sign intent', async () => {
      const abi = new ethers.utils.Interface(['function sign(uint256)'])
      const intent = await agreement.sign(SIGNER_ADDRESS, VERSION_NUMBER)

      expect(intent.transactions.length).toBe(1)
      expect(intent.destination.address).toBe(AGREEMENT_APP_ADDRESS)

      const transaction = intent.transactions[0]
      expect(transaction.to).toBe(AGREEMENT_APP_ADDRESS)
      expect(transaction.from).toBe(SIGNER_ADDRESS)
      expect(transaction.data).toBe(abi.encodeFunctionData('sign', [VERSION_NUMBER]))
    })
  })

  describe('settle', () => {
    const ACTION_NUMBER = '1'
    const SIGNER_ADDRESS = '0x0090aed150056316e37fe6dfa10dc63e79d173b6'

    test('returns a settle intent', async () => {
      const abi = new ethers.utils.Interface(['function settleAction(uint256)'])
      const intent = await agreement.settle(ACTION_NUMBER, SIGNER_ADDRESS)

      expect(intent.transactions.length).toBe(1)
      expect(intent.destination.address).toBe(AGREEMENT_APP_ADDRESS)

      const transaction = intent.transactions[0]
      expect(transaction.to).toBe(AGREEMENT_APP_ADDRESS)
      expect(transaction.from).toBe(SIGNER_ADDRESS)
      expect(transaction.data).toBe(abi.encodeFunctionData('settleAction', [ACTION_NUMBER]))
    })
  })

  describe('close', () => {
    const ACTION_NUMBER = '1'
    const SIGNER_ADDRESS = '0x0090aed150056316e37fe6dfa10dc63e79d173b6'

    test('returns a close intent', async () => {
      const abi = new ethers.utils.Interface(['function closeAction(uint256)'])
      const intent = await agreement.close(ACTION_NUMBER, SIGNER_ADDRESS)

      expect(intent.transactions.length).toBe(1)
      expect(intent.destination.address).toBe(AGREEMENT_APP_ADDRESS)

      const transaction = intent.transactions[0]
      expect(transaction.to).toBe(AGREEMENT_APP_ADDRESS)
      expect(transaction.from).toBe(SIGNER_ADDRESS)
      expect(transaction.data).toBe(abi.encodeFunctionData('closeAction', [ACTION_NUMBER]))
    })
  })

  describe('challenge', () => {
    const ACTION_NUMBER = '1'
    const SETTLEMENT_OFFER = '20'
    const CONTEXT = 'challenger evidence'
    const SIGNER_ADDRESS = '0x0090aed150056316e37fe6dfa10dc63e79d173b6'

    test('returns a challenge intent', async () => {
      const erc20ABI = new ethers.utils.Interface(['function approve(address,uint256) public returns (bool)'])
      const agreementABI = new ethers.utils.Interface(['function challengeAction(uint256,uint256,bool,bytes)'])
      const intent = await agreement.challenge(ACTION_NUMBER, SETTLEMENT_OFFER, true, CONTEXT, SIGNER_ADDRESS)

      expect(intent.transactions.length).toBe(2)
      expect(intent.destination.address).toBe(AGREEMENT_APP_ADDRESS)

      const action = (await agreement.action(ACTION_NUMBER))!
      const disputeFees = await agreement.disputeFees(action.versionId)
      const collateralRequirement = await action.collateralRequirement()
      const expectedApprovalAmount = bn(collateralRequirement.challengeAmount).add(disputeFees.feeAmount)

      const firstTransaction = intent.transactions[0]
      expect(firstTransaction.to.toLowerCase()).toBe(disputeFees.feeToken.toLowerCase())
      expect(firstTransaction.from.toLowerCase()).toBe(SIGNER_ADDRESS)
      expect(firstTransaction.data).toBe(erc20ABI.encodeFunctionData('approve', [AGREEMENT_APP_ADDRESS, expectedApprovalAmount]))

      const secondTransaction = intent.transactions[1]
      expect(secondTransaction.to.toLowerCase()).toBe(AGREEMENT_APP_ADDRESS)
      expect(secondTransaction.from).toBe(SIGNER_ADDRESS)
      expect(secondTransaction.data).toBe(agreementABI.encodeFunctionData('challengeAction', [ACTION_NUMBER, SETTLEMENT_OFFER, true, ethers.utils.toUtf8Bytes(CONTEXT)]))
    })
  })

  describe('dispute', () => {
    const ACTION_NUMBER = '1'
    const SIGNER_ADDRESS = '0x0090aed150056316e37fe6dfa10dc63e79d173b6'

    test('returns a dispute intent', async () => {
      const erc20ABI = new ethers.utils.Interface(['function approve(address,uint256) public returns (bool)'])
      const agreementABI = new ethers.utils.Interface(['function disputeAction(uint256,bool)'])
      const intent = await agreement.dispute(ACTION_NUMBER, true, SIGNER_ADDRESS)

      expect(intent.transactions.length).toBe(2)
      expect(intent.destination.address).toBe(AGREEMENT_APP_ADDRESS)

      const action = (await agreement.action(ACTION_NUMBER))!
      const disputeFees = await agreement.disputeFees(action.versionId)

      const firstTransaction = intent.transactions[0]
      expect(firstTransaction.to.toLowerCase()).toBe(disputeFees.feeToken.toLowerCase())
      expect(firstTransaction.from.toLowerCase()).toBe(SIGNER_ADDRESS)
      expect(firstTransaction.data).toBe(erc20ABI.encodeFunctionData('approve', [AGREEMENT_APP_ADDRESS, disputeFees.feeAmount]))

      const secondTransaction = intent.transactions[1]
      expect(secondTransaction.to.toLowerCase()).toBe(AGREEMENT_APP_ADDRESS)
      expect(secondTransaction.from).toBe(SIGNER_ADDRESS)
      expect(secondTransaction.data).toBe(agreementABI.encodeFunctionData('disputeAction', [ACTION_NUMBER, true]))
    })
  })
})
