import { QueryResult } from '@aragon/connect-thegraph'
import { Cast as CastDataGql } from '../queries/types'
import { CastData } from '../entities/Cast'

export function parseCasts(result: QueryResult): CastData[] {
  const casts = result.data.casts

  if (!casts) {
    throw new Error('Unable to parse casts.')
  }

  return casts.map(
    (cast: CastDataGql): CastData => {
      return {
        id: cast.id,
        voteId: cast.voteId,
        voter: cast.voter,
        supports: cast.supports,
      }
    }
  )
}
