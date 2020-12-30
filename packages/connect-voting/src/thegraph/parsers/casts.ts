import { ErrorUnexpectedResult } from '@aragon/connect-core'
import { QueryResult } from '@aragon/connect-thegraph'
import Cast from '../../models/Cast'
import { CastData } from '../../types'

export function parseCasts(result: QueryResult): Cast[] {
  const casts = result.data.casts

  if (!casts) {
    throw new ErrorUnexpectedResult('Unable to parse casts.')
  }

  const datas = casts.map(
    (cast: any): CastData => {
      return {
        id: cast.id,
        vote: cast.vote,
        voter: cast.voter,
        supports: cast.supports,
        stake: cast.stake,
        createdAt: cast.createdAt,
      }
    }
  )

  return datas.map((data: CastData) => {
    return new Cast(data)
  })
}
