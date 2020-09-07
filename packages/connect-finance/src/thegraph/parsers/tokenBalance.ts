import { ErrorUnexpectedResult } from '@aragon/connect-core'
import { QueryResult } from '@aragon/connect-thegraph'
import TokenBalance from '../../models/TokenBalance'

export function parseTokenBalance(result: QueryResult): TokenBalance {
  const tokenBalance = result.data.tokenBalances[0]

  if (!tokenBalance) {
    throw new ErrorUnexpectedResult('Unable to parse TokenBalance.')
  }

  return new TokenBalance(tokenBalance)
}
