import { QueryResult } from '@aragon/connect-thegraph'
import TokenHolder from '../../models/TokenHolder'
import { TokenHolderData } from '../../types'

export function parseTokenHolders(result: QueryResult): TokenHolder[] {
  const holders = result.data.tokenHolders

  if (!holders) {
    throw new Error('Unable to parse token holders.')
  }

  const datas = holders.map(
    (holder: any): TokenHolderData => {
      return holder
    }
  )

  return datas.map((data: TokenHolderData) => {
    return new TokenHolder(data)
  })
}
