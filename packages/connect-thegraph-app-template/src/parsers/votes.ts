import { Vote as VoteDataGql } from '../queries/types'
import { VoteData } from '../entities/Vote'
import { QueryResult } from '@aragon/connect-thegraph'

export function parseVotes(result: QueryResult): VoteData[] {
  const votes = result.data.votes

  if (!votes) {
    throw new Error('Unable to parse votes.')
  }

  // Note, this may seem redundant, but it makes sure
  // types are enforced.
  return votes.map(
    (vote: VoteDataGql): VoteData => {
      return vote
    }
  )
}
