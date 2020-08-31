import { QueryResult } from '@aragon/connect-thegraph'

import ERC20 from '../../models/ERC20'

export function parseERC20(result: QueryResult): ERC20 {
  const erc20 = result.data.erc20

  if (!erc20) {
    throw new Error('Unable to parse ERC20.')
  }

  return new ERC20(erc20)
}
