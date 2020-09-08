import { BigInt } from '@graphprotocol/graph-ts'
import { Vote as VoteEntity } from '../generated/schema'
import { buildVoteId, updateVoteState } from './DisputableVoting'
import {
  Agreement as AgreementContract,
  ActionDisputed as ActionDisputedEvent,
  ActionSettled as ActionSettledEvent,
  ActionClosed as ActionClosedEvent
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
  vote.save()
}

export function handleActionSettled(event: ActionSettledEvent): void {
  const agreementApp = AgreementContract.bind(event.address)
  const actionData = agreementApp.getAction(event.params.actionId)
  const voteId = buildVoteId(actionData.value0, actionData.value1)

  const vote = VoteEntity.load(voteId)!
  vote.status = 'Settled'
  vote.save()
}

export function handleActionClosed(event: ActionClosedEvent): void {
  const agreementApp = AgreementContract.bind(event.address)
  const actionData = agreementApp.getAction(event.params.actionId)

  if (actionData.value7 === BigInt.fromI32(0)) {
    updateVoteState(actionData.value0, actionData.value1)
  }
}
