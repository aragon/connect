import { QueryResult } from '@aragon/connect-thegraph'
import Token from '../../models/Token'
import { TokenData } from '../../types'

export function parseToken(result: QueryResult): Token {
  const token = result.data.miniMeTokens[0]

  if (!token) {
    throw new Error('Unable to parse token.')
  }

  return new Token(token as TokenData)
}
