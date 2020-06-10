import { QueryResult } from '@aragon/connect-thegraph'
import { TokenHolder as TokenHolderDataGql } from '../queries/types'
import TokenHolder, { TokenHolderData } from '../entities/TokenHolder'

export function parseTokenHolders(
  result: QueryResult,
  connector: any
): TokenHolder[] {
  const holders = result.data.tokenHolders as TokenHolderDataGql[]

  if (!holders) {
    throw new Error('Unable to parse token holders.')
  }

  const datas = holders.map(
    (holder: TokenHolderDataGql): TokenHolderData => {
      return holder
    }
  )

  return datas.map((data: TokenHolderData) => {
    return new TokenHolder(data, connector)
  })
}
