import { QueryResult } from '@aragon/connect-thegraph'

import Vote from '../../models/Vote'
import { VoteData } from '../../types'

function buildVote(vote: any, connector: any): Vote {
  const {
    id,
    voting,
    voteId,
    creator,
    context,
    status,
    actionId,
    challengeId,
    challenger,
    challengeEndDate,
    disputeId,
    setting,
    startDate,
    totalPower,
    snapshotBlock,
    yeas,
    nays,
    pausedAt,
    pauseDuration,
    quietEndingExtensionDuration,
    quietEndingSnapshotSupport,
    script,
    settledAt,
    disputedAt,
    executedAt,
    isAccepted,
    submitterArbitratorFee,
    challengerArbitratorFee,
  } = vote

  const voteData: VoteData = {
    id,
    votingId: voting.id,
    voteId,
    creator,
    duration: setting.voteTime,
    quietEndingExtension: setting.quietEndingExtension,
    context,
    status,
    actionId,
    challengeId,
    challenger,
    challengeEndDate,
    disputeId,
    settingId: setting.id,
    startDate,
    totalPower,
    snapshotBlock,
    yeas,
    nays,
    pausedAt,
    pauseDuration,
    quietEndingExtensionDuration,
    quietEndingSnapshotSupport,
    script,
    settledAt,
    disputedAt,
    executedAt,
    isAccepted,
    tokenDecimals: voting.token.decimals,
    submitterArbitratorFeeId: submitterArbitratorFee ? submitterArbitratorFee.id : null,
    challengerArbitratorFeeId: challengerArbitratorFee ? challengerArbitratorFee.id : null
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
