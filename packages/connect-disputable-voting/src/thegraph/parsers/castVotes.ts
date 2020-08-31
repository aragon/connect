import { QueryResult } from '@aragon/connect-thegraph'

import CastVote from '../../models/CastVote'
import { CastVoteData } from '../../types'

function buildCastVote(castVote: any, connector: any): CastVote {
  const { id, vote, voter, caster, supports, stake, createdAt } = castVote

  const castVoteData: CastVoteData = {
    id,
    voteId: vote.id,
    voterId: voter.id,
    caster,
    supports,
    stake,
    createdAt,
  }

  return new CastVote(castVoteData, connector)
}

export function parseCastVote(
  result: QueryResult,
  connector: any
): CastVote | null {
  const castVote = result.data.castVote
  return castVote ? buildCastVote(castVote, connector) : null
}

export function parseCastVotes(
  result: QueryResult,
  connector: any
): CastVote[] {
  const castVotes = result.data.castVotes

  if (!castVotes) {
    throw new Error('Unable to parse cast votes.')
  }

  return castVotes.map((castVote: any) => buildCastVote(castVote, connector))
}
