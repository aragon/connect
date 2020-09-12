import { QueryResult } from '@aragon/connect-thegraph'
import { providers as ethersProviders } from 'ethers'

import ERC20 from '../../models/ERC20'

export function parseERC20(result: QueryResult, provider: ethersProviders.Provider): ERC20 {
  const erc20 = result.data.erc20

  if (!erc20) {
    throw new Error('Unable to parse ERC20.')
  }

  return new ERC20(erc20, provider)
}
