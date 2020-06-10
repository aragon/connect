import { QueryResult } from '@aragon/connect-thegraph'
import { Cast as CastDataGql } from '../queries/types'
import Cast, { CastData } from '../entities/Cast'

export function parseCasts(
  result: QueryResult,
  connector: any
): Cast[] {
  const casts = result.data.casts

  if (!casts) {
    throw new Error('Unable to parse casts.')
  }

  const datas = casts.map(
    (cast: CastDataGql): CastData => {
      return {
        id: cast.id,
        voteId: cast.voteId,
        voter: cast.voter,
        supports: cast.supports,
      }
    }
  )

  return datas.map((data: CastData) => {
    return new Cast(data, connector)
  })
}
