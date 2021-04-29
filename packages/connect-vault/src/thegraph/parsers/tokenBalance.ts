import { QueryResult } from '@aragon/connect-thegraph'

import TokenBalance from '../../models/TokenBalance'
import { TokenBalanceData } from '../../types'

export function parseTokenBalances(result: QueryResult): TokenBalance[] {
  const tokenBalances = result.data.tokenBalances
  return tokenBalances.map((data: TokenBalanceData) => new TokenBalance(data))
}
