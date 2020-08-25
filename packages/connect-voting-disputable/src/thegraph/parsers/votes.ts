import { QueryResult } from '@aragon/connect-thegraph'

import Vote from '../../models/Vote'
import { VoteData } from '../../types'

function buildVote(vote: any, connector: any): Vote {
  const {
    id,
    voting,
    voteId,
    creator,
    duration,
    context,
    status,
    actionId,
    challengeId,
    challenger,
    challengeEndDate,
    disputeId,
    setting,
    startDate,
    votingPower,
    snapshotBlock,
    yeas,
    nays,
    pausedAt,
    pauseDuration,
    quietEndingExtendedSeconds,
    quietEndingSnapshotSupport,
    script,
    executedAt,
    isAccepted,
  } = vote

  const voteData: VoteData = {
    id,
    votingId: voting.id,
    voteId,
    creator,
    duration,
    context,
    status,
    actionId,
    challengeId,
    challenger,
    challengeEndDate,
    disputeId,
    settingId: setting.id,
    startDate,
    votingPower,
    snapshotBlock,
    yeas,
    nays,
    pausedAt,
    pauseDuration,
    quietEndingExtendedSeconds,
    quietEndingSnapshotSupport,
    script,
    executedAt,
    isAccepted,
    tokenDecimals: voting.token.decimals
  }

  return new Vote(voteData, connector)
}

export function parseVote(result: QueryResult, connector: any): Vote {
  const vote = result.data.vote

  if (!vote) {
    throw new Error('Unable to parse vote.')
  }

  return buildVote(vote, connector)
}

export function parseVotes(result: QueryResult, connector: any): Vote[] {
  const votes = result.data.votes

  if (!votes) {
    throw new Error('Unable to parse votes.')
  }

  return votes.map((vote: any) => buildVote(vote, connector))
}
