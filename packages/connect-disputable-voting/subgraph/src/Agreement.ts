import { buildVoteId } from './DisputableVoting'
import { Vote as VoteEntity } from '../generated/schema'
import {
  Agreement as AgreementContract,
  ActionDisputed as ActionDisputedEvent,
  ActionSettled as ActionSettledEvent
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
  vote.save()
}

export function handleActionSettled(event: ActionSettledEvent): void {
  const agreementApp = AgreementContract.bind(event.address)
  const actionData = agreementApp.getAction(event.params.actionId)
  const voteId = buildVoteId(actionData.value0, actionData.value1)

  const vote = VoteEntity.load(voteId)!
  vote.settledAt = event.block.timestamp
  vote.save()
}
