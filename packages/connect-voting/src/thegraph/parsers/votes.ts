import { ErrorUnexpectedResult } from '@aragon/connect-core'
import { QueryResult } from '@aragon/connect-thegraph'
import Vote from '../../models/Vote'
import { VoteData } from '../../types'

export function parseVotes(result: QueryResult, connector: any): Vote[] {
  const votes = result.data.votes

  if (!votes) {
    throw new ErrorUnexpectedResult('Unable to parse votes.')
  }

  const datas = votes.map(
    (vote: any): VoteData => {
      return vote
    }
  )

  return datas.map((data: VoteData) => {
    return new Vote(data, connector)
  })
}
