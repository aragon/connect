import { GraphQLWrapper } from '@aragon/connect-thegraph'
import * as queries from './queries'
import Token from './entities/Token'
import TokenHolder, { TokenHolderData } from './entities/TokenHolder'
import { parseToken, parseTokenHolders } from './parsers'

export default class TokenManagerConnectorTheGraph extends GraphQLWrapper {
  async token(tokenManagerAddress: string): Promise<Token> {
    const result = await this.performQuery(queries.TOKEN, {
      tokenManagerAddress,
    })

    const data = this.parseQueryResult(parseToken, result)

    return new Token(data, this)
  }

  async tokenHolders(tokenAddress: string): Promise<TokenHolder[]> {
    const result = await this.performQuery(queries.TOKEN_HOLDERS, {
      tokenAddress,
    })

    const datas = this.parseQueryResult(parseTokenHolders, result)

    return datas.map((data: TokenHolderData) => {
      return new TokenHolder(data, this)
    })
  }
}
