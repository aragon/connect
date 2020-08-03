import { buildVoteId } from './DisputableVoting'
import { Vote } from '../generated/schema'
import { Agreement, ActionDisputed } from '../generated/templates/Agreement/Agreement'

/* eslint-disable @typescript-eslint/no-use-before-define */

export function handleActionDisputed(event: ActionDisputed): void {
  const agreementApp = Agreement.bind(event.address)
  const actionData = agreementApp.getAction(event.params.actionId)
  const voteId = buildVoteId(actionData.value0, actionData.value1)

  const vote = Vote.load(voteId)!
  vote.status = 'Disputed'
  vote.save()
}
