import { BigInt, Address } from '@graphprotocol/graph-ts'
import { buildVoteId, buildERC20 } from './DisputableVoting'
import { Vote as VoteEntity, ArbitratorFee as ArbitratorFeeEntity } from '../generated/schema'
import {
  Agreement as AgreementContract,
  ActionDisputed as ActionDisputedEvent,
  ActionSettled as ActionSettledEvent,
  ActionChallenged as ActionChallengedEvent
} from '../generated/templates/Agreement/Agreement'

/* eslint-disable @typescript-eslint/no-use-before-define */

export function handleActionDisputed(event: ActionDisputedEvent): void {
  const agreementApp = AgreementContract.bind(event.address)
  const actionData = agreementApp.getAction(event.params.actionId)
  const challengeData = agreementApp.getChallenge(event.params.challengeId)
  const voteId = buildVoteId(actionData.value0, actionData.value1)

  const vote = VoteEntity.load(voteId)!
  vote.status = 'Disputed'
  vote.disputeId = challengeData.value8
  vote.disputedAt = event.block.timestamp

  const submitterArbitratorFeeId = voteId + '-submitter'
  const challengeArbitratorFeesData = agreementApp.getChallengeArbitratorFees(event.params.challengeId)
  createArbitratorFee(voteId, submitterArbitratorFeeId, challengeArbitratorFeesData.value0, challengeArbitratorFeesData.value1)

  vote.submitterArbitratorFee = submitterArbitratorFeeId
  vote.save()
}

export function handleActionSettled(event: ActionSettledEvent): void {
  const agreementApp = AgreementContract.bind(event.address)
  const actionData = agreementApp.getAction(event.params.actionId)
  const voteId = buildVoteId(actionData.value0, actionData.value1)

  const vote = VoteEntity.load(voteId)!
  vote.status = 'Settled'
  vote.settledAt = event.block.timestamp
  vote.save()
}

export function handleActionChallenged(event: ActionChallengedEvent): void {
  const agreementApp = AgreementContract.bind(event.address)
  const actionData = agreementApp.getAction(event.params.actionId)
  const voteId = buildVoteId(actionData.value0, actionData.value1)

  const challengerArbitratorFeeId = voteId + '-challenger'
  const challengeArbitratorFeesData = agreementApp.getChallengeArbitratorFees(event.params.challengeId)
  createArbitratorFee(voteId, challengerArbitratorFeeId, challengeArbitratorFeesData.value2, challengeArbitratorFeesData.value3)

  const vote = VoteEntity.load(voteId)!
  vote.challengerArbitratorFee = challengerArbitratorFeeId
  vote.save()
}

function createArbitratorFee(voteId: string, id: string, feeToken: Address, feeAmount: BigInt): void {
  const arbitratorFee = new ArbitratorFeeEntity(id)
  arbitratorFee.vote = voteId
  arbitratorFee.amount = feeAmount
  arbitratorFee.token = buildERC20(feeToken)
  arbitratorFee.save()
}
