import { QueryResult } from '@aragon/connect-thegraph'
import { VoteData } from '../../types'
import Vote from '../../models/Vote'

export function parseVotes(result: QueryResult, connector: any): Vote[] {
  const votes = result.data.votes

  if (!votes) {
    throw new Error('Unable to parse votes.')
  }

  const datas = votes.map(
    (vote: any): VoteData => {
      // TODO: ensure vote is safe
      return vote
    }
  )

  return datas.map((data: VoteData) => {
    return new Vote(data, connector)
  })
}
