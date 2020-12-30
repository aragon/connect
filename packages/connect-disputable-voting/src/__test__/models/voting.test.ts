import { ethers } from 'ethers'
import { buildDisputableVoting, VOTING_APP_ADDRESS } from '../utils'
import { ERC20, DisputableVoting, CollateralRequirement } from '../../../src'

describe('DisputableVoting', () => {
  let voting: DisputableVoting

  beforeAll(async () => {
    voting = await buildDisputableVoting()
  })

  afterAll(async () => {
    await voting.disconnect()
  })

  describe('current collateral requirement', () => {
    let collateralRequirement: CollateralRequirement

    beforeEach(async () => {
      collateralRequirement = await voting.currentCollateralRequirement()
    })

    test('has a collateral requirement associated', async () => {
      expect(collateralRequirement.id).toBe(`${VOTING_APP_ADDRESS}-collateral-${collateralRequirement.collateralRequirementId}`)
      expect(collateralRequirement.tokenId).toBe('0x3af6b2f907f0c55f279e0ed65751984e6cdc4a42')
      expect(collateralRequirement.actionAmount).toBe('1000000000000000000')
      expect(collateralRequirement.formattedActionAmount).toBe('1.00')
      expect(collateralRequirement.challengeAmount).toBe('2000000000000000000')
      expect(collateralRequirement.formattedChallengeAmount).toBe('2.00')
      expect(collateralRequirement.challengeDuration).toBe('259200')
    })

    test('can requests the related token info', async () => {
      const token: ERC20 = await collateralRequirement.token()

      expect(token.id).toBe('0x3af6b2f907f0c55f279e0ed65751984e6cdc4a42')
      expect(token.name).toBe('DAI Token')
      expect(token.symbol).toBe('DAI')
      expect(token.decimals).toBe(18)
    })
  })

  describe('new vote', () => {
    const SCRIPT = '0x00000001'
    const CONTEXT = 'challenger evidence'
    const SIGNER_ADDRESS = '0x0090aed150056316e37fe6dfa10dc63e79d173b6'

    it('returns a new vote intent', async () => {
      const votingABI = new ethers.utils.Interface(['function newVote(bytes,bytes)'])
      const intent = await voting.newVote(SCRIPT, CONTEXT, SIGNER_ADDRESS)

      expect(intent.transactions.length).toBe(2)
      expect(intent.destination.address).toBe(VOTING_APP_ADDRESS)

      const transaction = intent.transactions[1]
      expect(transaction.to.toLowerCase()).toBe(VOTING_APP_ADDRESS)
      expect(transaction.from).toBe(SIGNER_ADDRESS)
      expect(transaction.data).toBe(votingABI.encodeFunctionData('newVote', [SCRIPT, ethers.utils.toUtf8Bytes(CONTEXT)]))
    })
  })

  describe('castVote', () => {
    const VOTE_NUMBER = '12'
    const SUPPORT = true
    const SIGNER_ADDRESS = '0x0090aed150056316e37fe6dfa10dc63e79d173b6'

    it('returns a vote intent', async () => {
      const votingABI = new ethers.utils.Interface(['function vote(uint256,bool)'])
      const intent = await voting.castVote(VOTE_NUMBER, SUPPORT, SIGNER_ADDRESS)

      expect(intent.transactions.length).toBe(1)
      expect(intent.destination.address).toBe(VOTING_APP_ADDRESS)

      const transaction = intent.transactions[0]
      expect(transaction.to.toLowerCase()).toBe(VOTING_APP_ADDRESS)
      expect(transaction.from).toBe(SIGNER_ADDRESS)
      expect(transaction.data).toBe(votingABI.encodeFunctionData('vote', [VOTE_NUMBER, SUPPORT]))
    })
  })

  describe('executeVote', () => {
    const VOTE_NUMBER = '12'
    const SCRIPT = '0xabcdef'
    const SIGNER_ADDRESS = '0x0090aed150056316e37fe6dfa10dc63e79d173b6'

    it('returns an execute vote intent', async () => {
      const votingABI = new ethers.utils.Interface(['function executeVote(uint256,bytes)'])
      const intent = await voting.executeVote(VOTE_NUMBER, SCRIPT, SIGNER_ADDRESS)

      expect(intent.transactions.length).toBe(1)
      expect(intent.destination.address).toBe(VOTING_APP_ADDRESS)

      const transaction = intent.transactions[0]
      expect(transaction.to.toLowerCase()).toBe(VOTING_APP_ADDRESS)
      expect(transaction.from).toBe(SIGNER_ADDRESS)
      expect(transaction.data).toBe(votingABI.encodeFunctionData('executeVote', [VOTE_NUMBER, SCRIPT]))
    })
  })
})
