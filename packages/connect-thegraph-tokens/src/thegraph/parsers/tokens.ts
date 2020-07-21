import { QueryResult } from '@aragon/connect-thegraph'
import Token, { TokenData } from '../../entities/Token'

export function parseToken(result: QueryResult): Token {
  const token = result.data.miniMeTokens[0]

  if (!token) {
    throw new Error('Unable to parse token.')
  }

  return new Token(token as TokenData)
}
