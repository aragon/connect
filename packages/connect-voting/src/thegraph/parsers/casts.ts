import { QueryResult } from '@aragon/connect-thegraph'
import Cast from '../../models/Cast'
import { CastData } from '../../types'

export function parseCasts(result: QueryResult): Cast[] {
  const casts = result.data.casts

  if (!casts) {
    throw new Error('Unable to parse casts.')
  }

  const datas = casts.map(
    (cast: any): CastData => {
      return {
        id: cast.id,
        voteId: cast.voteId,
        voter: cast.voter,
        supports: cast.supports,
      }
    }
  )

  return datas.map((data: CastData) => {
    return new Cast(data)
  })
}
