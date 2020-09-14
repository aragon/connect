import { bn } from '../../helpers'
import { buildDisputableVoting, VOTING_APP_ADDRESS } from '../utils'
import { ERC20, Vote, CastVote, DisputableVoting, CollateralRequirement } from '../../../src'

describe('DisputableVoting', () => {
  let voting: DisputableVoting

  beforeAll(async () => {
    voting = await buildDisputableVoting()
  })

  afterAll(async () => {
    await voting.disconnect()
  })

  describe('end date', () => {
    let scheduledVote: Vote, settledVote: Vote

    beforeEach(async () => {
      scheduledVote = await voting.vote(`${VOTING_APP_ADDRESS}-vote-0`)
      settledVote = await voting.vote(`${VOTING_APP_ADDRESS}-vote-2`)
    })

    describe('when it was not flipped', () => {
      test('computes the end date properly', async () => {
        const expectedScheduledVoteEndDate =
          parseInt(scheduledVote.startDate) +
          parseInt(scheduledVote.duration)

        expect(scheduledVote.endDate).toBe(expectedScheduledVoteEndDate.toString())
        expect(scheduledVote.currentQuietEndingExtensionDuration).toBe('0')

        const expectedSettledVoteEndDate =
          parseInt(settledVote.startDate) +
          parseInt(settledVote.duration) +
          parseInt(settledVote.pauseDuration)

        expect(settledVote.endDate).toBe(expectedSettledVoteEndDate.toString())
        expect(settledVote.currentQuietEndingExtensionDuration).toBe('0')
      })
    })

    describe('when it was flipped', () => {
      beforeEach(async () => {
        Object.defineProperty(scheduledVote, 'wasFlipped', { value: true })
        Object.defineProperty(settledVote, 'wasFlipped', { value: true })
      })

      test('computes the end date properly', async () => {
        const expectedScheduledVoteEndDate =
          parseInt(scheduledVote.startDate) +
          parseInt(scheduledVote.duration) +
          parseInt(scheduledVote.quietEndingExtension)

        expect(scheduledVote.endDate).toBe(expectedScheduledVoteEndDate.toString())
        expect(scheduledVote.currentQuietEndingExtensionDuration).toBe(scheduledVote.quietEndingExtension)

        const expectedSettledVoteEndDate =
          parseInt(settledVote.startDate) +
          parseInt(settledVote.duration) +
          parseInt(settledVote.pauseDuration) +
          parseInt(settledVote.quietEndingExtension)

        expect(settledVote.endDate).toBe(expectedSettledVoteEndDate.toString())
        expect(settledVote.currentQuietEndingExtensionDuration).toBe(settledVote.quietEndingExtension)
      })
    })
  })

  describe('results', () => {
    describe('when the vote is challenged', () => {
      test('computes the current outcome properly', async () => {
        const vote = await voting.vote(`${VOTING_APP_ADDRESS}-vote-1`)

        expect(vote.hasEnded).toBe(true)
        expect(vote.isAccepted).toBe(false)
        expect(vote.status).toBe('Settled')

        expect(vote.totalPower).toBe('3000000000000000000')
        expect(vote.formattedTotalPower).toBe('3.00')

        expect(vote.yeas).toBe('0')
        expect(vote.yeasPct).toBe('0')
        expect(vote.formattedYeas).toBe('0.00')
        expect(vote.formattedYeasPct).toBe('0.00')

        expect(vote.nays).toBe('0')
        expect(vote.naysPct).toBe('0')
        expect(vote.formattedNays).toBe('0.00')
        expect(vote.formattedNaysPct).toBe('0.00')

        expect(await vote.canExecute()).toBe(false)
        expect(await vote.canVote('0x03acbcb547d03c8e7746ef5988012b59604aa083')).toBe(false)
      })
    })

    describe('when the vote is settled', () => {
      test('computes the current outcome properly', async () => {
        const vote = await voting.vote(`${VOTING_APP_ADDRESS}-vote-2`)

        expect(vote.hasEnded).toBe(true)
        expect(vote.isAccepted).toBe(false)
        expect(vote.status).toBe('Settled')

        expect(vote.totalPower).toBe('3000000000000000000')
        expect(vote.formattedTotalPower).toBe('3.00')

        expect(vote.yeas).toBe('0')
        expect(vote.yeasPct).toBe('0')
        expect(vote.formattedYeas).toBe('0.00')
        expect(vote.formattedYeasPct).toBe('0.00')

        expect(vote.nays).toBe('0')
        expect(vote.naysPct).toBe('0')
        expect(vote.formattedNays).toBe('0.00')
        expect(vote.formattedNaysPct).toBe('0.00')

        expect(await vote.canExecute()).toBe(false)
        expect(await vote.canVote('0x03acbcb547d03c8e7746ef5988012b59604aa083')).toBe(false)
      })
    })
  })

  describe('setting', () => {
    test('allows querying the vote settings', async () => {
      const vote = await voting.vote(`${VOTING_APP_ADDRESS}-vote-3`)
      const setting = await vote.setting()

      expect(setting.id).toBe(`${VOTING_APP_ADDRESS}-setting-0`)
      expect(setting.supportRequiredPct).toBe('500000000000000000')
      expect(setting.formattedSupportRequiredPct).toBe('50.00')
      expect(setting.minimumAcceptanceQuorumPct).toBe('500000000000000000')
      expect(setting.formattedMinimumAcceptanceQuorumPct).toBe('50.00')
      expect(setting.quietEndingPeriod).toBe('86400')
      expect(setting.quietEndingExtension).toBe('43200')
      expect(setting.delegatedVotingPeriod).toBe('172800')
      expect(setting.executionDelay).toBe('0')
    })
  })

  describe('castVote', () => {
    let vote: Vote
    const VOTE_ID = `${VOTING_APP_ADDRESS}-vote-0`

    beforeAll(async () => {
      vote = await voting.vote(VOTE_ID)
    })

    describe('when querying an non-existing voter', () => {
      let castVote: CastVote | null
      const VOTER_ADDRESS = '0x03acbcb547d03c8e7746ef5988012b59604aa083'

      beforeAll(async () => {
        castVote = await vote.castVote(VOTER_ADDRESS)
        expect(await vote.hasVoted(VOTER_ADDRESS)).toBe(false)
      })

      it('returns a null value', async () => {
        expect(castVote).toBeNull()
      })
    })

    describe('when querying an existing voter', () => {
      let castVote: CastVote
      const VOTER_ADDRESS = '0x0090aed150056316e37fe6dfa10dc63e79d173b6'

      beforeAll(async () => {
        expect(await vote.hasVoted(VOTER_ADDRESS)).toBe(true)
        castVote = (await vote.castVote(VOTER_ADDRESS))!
      })

      test('fetches the cast vote info', async () => {
        expect(castVote.id).toBe(`${VOTE_ID}-cast-${VOTER_ADDRESS}`)
        expect(castVote.supports).toBe(true)
        expect(castVote.stake).toBe('1000000000000000000')
        expect(castVote.createdAt).toBe('1598530298')
        expect(castVote.caster).toBe(VOTER_ADDRESS)
      })

      test('allows telling the voter', async () => {
        const voter = await castVote.voter()
        expect(voter.address).toBe(VOTER_ADDRESS)
        expect(voter.representative).toBe(null)
      })
    })
  })

  describe('collateralRequirement', () => {
    const voteId = `${VOTING_APP_ADDRESS}-vote-2`

    let collateralRequirement: CollateralRequirement

    beforeAll(async () => {
      const vote = await voting.vote(voteId)
      collateralRequirement = await vote.collateralRequirement()
    })

    test('has a collateral requirement associated', async () => {
      expect(collateralRequirement.id).toBe(`${VOTING_APP_ADDRESS}-collateral-${collateralRequirement.collateralRequirementId}`)
      expect(collateralRequirement.tokenId).toBe('0x3af6b2f907f0c55f279e0ed65751984e6cdc4a42')
      expect(collateralRequirement.actionAmount).toBe('0')
      expect(collateralRequirement.challengeAmount).toBe('0')
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

  describe('arbitrator fees', () => {
    let vote: Vote
    const voteId = `${VOTING_APP_ADDRESS}-vote-13`

    beforeAll(async () => {
      vote = await voting.vote(voteId)
    })

    test('can requests the submitter arbitrator fees', async () => {
      const artbiratorFee = (await vote.submitterArbitratorFee())!

      expect(artbiratorFee.id).toBe(`${voteId}-submitter`)
      expect(artbiratorFee.tokenId).toBe('0x3af6b2f907f0c55f279e0ed65751984e6cdc4a42')
      expect(artbiratorFee.formattedAmount).toBe('150.00')
    })

    test('can requests the submitter arbitrator fees', async () => {
      const artbiratorFee = (await vote.challengerArbitratorFee())!

      expect(artbiratorFee.id).toBe(`${voteId}-challenger`)
      expect(artbiratorFee.tokenId).toBe('0x3af6b2f907f0c55f279e0ed65751984e6cdc4a42')
      expect(artbiratorFee.formattedAmount).toBe('150.00')
    })
  })

  describe('balances', () => {
    let vote: Vote
    const VOTE_ID = `${VOTING_APP_ADDRESS}-vote-0`
    const VOTER_ADDRESS = '0x0090aed150056316e37fe6dfa10dc63e79d173b6'

    beforeAll(async () => {
      vote = await voting.vote(VOTE_ID)
    })

    test('tells the balance at the moment of the vote', async () => {
      expect(await vote.formattedVotingPower(VOTER_ADDRESS)).toBe('1.00')
    })

    test('tells the current balance of a voter', async () => {
      const token = await vote.token()

      expect((await token.balance(VOTER_ADDRESS)).gte(bn(0))).toBe(true)
    })
  })
})
