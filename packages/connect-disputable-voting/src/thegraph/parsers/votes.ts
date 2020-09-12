import { QueryResult } from '@aragon/connect-thegraph'

import Vote from '../../models/Vote'
import { VoteData } from '../../types'

function buildVote(vote: any, connector: any, provider: any): Vote {
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
    collateralRequirement,
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
    tokenId: voting.token.id,
    tokenDecimals: voting.token.decimals,
    collateralRequirementId: collateralRequirement.id,
    submitterArbitratorFeeId: submitterArbitratorFee ? submitterArbitratorFee.id : null,
    challengerArbitratorFeeId: challengerArbitratorFee ? challengerArbitratorFee.id : null
  }

  return new Vote(voteData, connector, provider)
}

export function parseVote(result: QueryResult, connector: any, provider: any): Vote {
  const vote = result.data.vote

  if (!vote) {
    throw new Error('Unable to parse vote.')
  }

  return buildVote(vote, connector, provider)
}

export function parseVotes(result: QueryResult, connector: any, provider: any): Vote[] {
  const votes = result.data.votes

  if (!votes) {
    throw new Error('Unable to parse votes.')
  }

  return votes.map((vote: any) => buildVote(vote, connector, provider))
}
