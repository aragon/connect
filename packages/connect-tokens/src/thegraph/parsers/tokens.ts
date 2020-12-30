import { ErrorUnexpectedResult } from '@aragon/connect-core'
import { QueryResult } from '@aragon/connect-thegraph'
import Token from '../../models/Token'
import { TokenData } from '../../types'

export function parseToken(result: QueryResult): Token {
  const token = result.data.miniMeTokens[0]

  if (!token) {
    throw new ErrorUnexpectedResult('Unable to parse token.')
  }

  return new Token(token as TokenData)
}
