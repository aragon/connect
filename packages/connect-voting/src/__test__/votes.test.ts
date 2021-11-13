import { BigNumber } from 'ethers'
import { App, connect } from '@aragon/connect'
import { VotingConnectorTheGraph, Vote, Cast } from '../../src'
import { Action, VoteStatus } from '../types'

const VOTING_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-voting-rinkeby'

const VOTING_APP_ADDRESS = '0x37187b0f2089b028482809308e776f92eeb7334e'
// For testing vote action functionality
const ACTIONS_ORG_ADDRESS = "0x63210F64Ef6F4EBB9727F6c5665CB8bbeDf20480"
const ACTIONS_VOTING_APP_ADDRESS = '0x9943c2f55d91308b8ddbc58b6e70d1774ace125e'

describe('when connecting to a voting app', () => {
  let connector: VotingConnectorTheGraph
  let votes: Vote[]

  beforeAll(() => {
    connector = new VotingConnectorTheGraph({
      subgraphUrl: VOTING_SUBGRAPH_URL,
    })
  })

  afterAll(async () => {
    await connector.disconnect()
  })

  describe('when querying for all the votes of a voting app', () => {
    beforeAll(async () => {
      votes = await connector.votesForApp(VOTING_APP_ADDRESS, 1000, 0)
    })

    test('returns a list of votes', () => {
      expect(votes.length).toBeGreaterThan(0)
    })

    describe('when looking at a vote', () => {
      let vote: Vote

      beforeAll(() => {
        vote = votes[13]
      })

      test('should not be executed', () => {
        expect(vote.executed).toBe(false)
      })

      test('should have nays', () => {
        expect(vote.nay).toBe('18000000000000000000000')
      })

      test('should have yeas', () => {
        expect(vote.yea).toBe('5400000000000000000000')
      })

      test('has the expected script', () => {
        expect(vote.script).toEqual(
          '0x0000000138daca8c123145ead833c42590f4e359fd6bfa0c00000124d948d468000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000e0000000015616500b003475136ee6b0844896a2e1ccc68140000000c4d948d46800000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000080000000018b8fc0e17c2900d669cc883e3b067e413536240200000064b0c8f9dc000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000076e65776e616d6500000000000000000000000000000000000000000000000000'
        )
      })

      test('should have a valid creator', () => {
        expect(vote.creator).toEqual(
          '0xadb56e6b6a10c8a1b7fe859b1284cfd74a7bcd1f'
        )
      })

      test('should have a valid original creator', () => {
        expect(vote.originalCreator).toBe('0x8cff6832174091dae86f0244e3fd92d4ced2fe07')
      })

      test('should have valid metadata', () => {
        expect(vote.metadata).toEqual(``)
      })

      test('should have a valid minAcceptQuorum', () => {
        expect(vote.minAcceptQuorum).toEqual('10000000000000000')
      })

      test('should have a valid supportRequiredPct', () => {
        expect(vote.supportRequiredPct).toEqual('250000000000000000')
      })

      test('should have a valid votingPower', () => {
        expect(vote.votingPower).toEqual('29531000000000000000000')
      })

      test('should have a valid snapshotBlock', () => {
        expect(vote.snapshotBlock).toEqual('7167970')
      })

      test('should have a valid startDate', () => {
        expect(vote.startDate).toEqual('1599675534')
      })

      test('should have a valid endDate', () => {
        expect(vote.endDate).toEqual('1600280334')
      })

      test('should have not be accepted', () => {
        expect(vote.isAccepted).toBe(false)
      })

      test('should have a valid status', () => {
        expect(vote.status).toEqual(VoteStatus.Rejected)
      })

      describe('when querying for the casts of a vote', () => {
        let casts: Cast[]

        beforeAll(async () => {
          casts = await vote.casts()
        })

        test('retrieves casts', () => {
          expect(casts.length).toBeGreaterThan(0)
        })
      })
    })
  })

  describe("when looking at the votes actions of a voting app", () => {
    let installedApps: App[]
    let signallingVoteActions: Action[]
    let codeExecutionVoteActions: Action[]
    let voteActions: Action[]

    beforeAll(async () => {
      const org = await connect(ACTIONS_ORG_ADDRESS, "thegraph", { network: 4 })
      installedApps = await org.apps()
      connector = new VotingConnectorTheGraph({
        subgraphUrl: VOTING_SUBGRAPH_URL,
      })
      votes = await connector.votesForApp(ACTIONS_VOTING_APP_ADDRESS, 1000, 0)

      codeExecutionVoteActions = votes[0].getActions(installedApps)
      signallingVoteActions = votes[1].getActions(installedApps)
      voteActions = votes[4].getActions(installedApps)
    })

    test("should return a list of actions", () => {
      expect(voteActions.length).toBeGreaterThan(0)
    })

    test("shouldn't return anything when getting actions from a signaling vote", () => {
      expect(signallingVoteActions).toEqual([])
    })

    test("shouldn't return rewards when getting actions from a vote that only executes code", () => {
      const action = codeExecutionVoteActions[0]
      expect(action.rewards).toEqual([])
    })

    describe("when looking at a specific vote's action and reward", () => {
      let rewardedAction: Action

      beforeAll(() => {
        rewardedAction = voteActions[0]
      })

      test('should have a valid to (target contract address)', () => {
        expect(rewardedAction.to).toEqual("0xcaa6526abb106ff5c5f937e3ea9499243df86b7a")
      })

      test("should have a valid fnData", () => {
        const { abi, notice, params, roles, sig } = rewardedAction.fnData!

        expect(Object.keys(abi!).length).toBeGreaterThan(0)
        expect(notice).toEqual("Create a new payment of `@tokenAmount(_token, _amount)` to `_receiver` for '`_reference`'")
        expect(params!).toEqual(['0x0000000000000000000000000000000000000000',
        '0x9943c2f55D91308B8DDbc58B6e70d1774AcE125e', BigNumber.from('3000000000000000000'), "\"reference\""])
        expect(roles).toEqual([ 'CREATE_PAYMENTS_ROLE' ])
        expect(sig).toEqual("newImmediatePayment(address,address,uint256,string)")
      })

      test("should have a list of rewards", () => {
        expect(rewardedAction.rewards.length).toBeGreaterThan(0)
      })

      test("should have a valid reward", () => {
        const reward = rewardedAction.rewards[0]
        const { amount, token, receiver } = reward
        const ETH = '0x0000000000000000000000000000000000000000'

        expect(amount).toEqual('3000000000000000000')
        expect(token).toEqual(ETH)
        expect(receiver).toEqual('0x9943c2f55D91308B8DDbc58B6e70d1774AcE125e')
      })
    })

  })

})
