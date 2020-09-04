import { Action } from '../generated/schema'
import { buildActionId } from './Agreement'

import {
  StartVote as StartVoteEvent,
  DisputableVoting as DisputableVotingContract
} from '../generated/templates/DisputableVoting/DisputableVoting'


export function handleStartVote(event: StartVoteEvent): void {
  const votingApp = DisputableVotingContract.bind(event.address)
  const voteData = votingApp.getVote(event.params.voteId)

  const actionId = buildActionId(event.address, voteData.value7)
  const action = Action.load(actionId)!
  action.script = event.params.executionScript
  action.save()
}
