import { QueryResult } from '@aragon/connect-thegraph'
import { MiniMeToken as MiniMeTokenDataGql } from '../queries/types'
import { TokenData } from '../entities/Token'

export function parseToken(result: QueryResult): TokenData {
  const token = result.data.miniMeTokens[0] as MiniMeTokenDataGql

  if (!token) {
    throw new Error('Unable to parse token.')
  }

  return token
}
