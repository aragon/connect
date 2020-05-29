import { QueryResult } from '@aragon/connect-thegraph'
import { TokenHolder as TokenHolderDataGql } from '../queries/types'
import { TokenHolderData } from '../entities/TokenHolder'

export function parseTokenHolders(result: QueryResult): TokenHolderData[] {
  const holders = result.data.tokenHolders as TokenHolderDataGql[]

  if (!holders) {
    throw new Error('Unable to parse token holders.')
  }

  return holders.map(
    (holder: TokenHolderDataGql): TokenHolderData => {
      return holder
    }
  )
}
