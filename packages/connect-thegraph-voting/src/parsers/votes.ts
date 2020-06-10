import { QueryResult } from '@aragon/connect-thegraph'
import { Vote as VoteDataGql } from '../queries/types'
import Vote, { VoteData } from '../entities/Vote'

export function parseVotes(
  result: QueryResult,
  connector: any
): Vote[] {
  const votes = result.data.votes

  if (!votes) {
    throw new Error('Unable to parse votes.')
  }

  const datas = votes.map(
    (vote: VoteDataGql): VoteData => {
      return vote
    }
  )

  return datas.map((data: VoteData) => {
    return new Vote(data, connector)
  })
}
