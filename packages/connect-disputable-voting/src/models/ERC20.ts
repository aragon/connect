import { miniMeAbi } from '@aragon/connect-core'
import { BigNumber, Contract, providers as ethersProviders } from 'ethers'

import { ERC20Data } from '../types'

export default class ERC20 {
  #ethersProvider: ethersProviders.Provider

  readonly id: string
  readonly name: string
  readonly symbol: string
  readonly decimals: string

  constructor(data: ERC20Data, ethersProvider: ethersProviders.Provider) {
    this.#ethersProvider = ethersProvider

    this.id = data.id
    this.name = data.name
    this.symbol = data.symbol
    this.decimals = data.decimals
  }

  async balance(address: string): Promise<BigNumber> {
    return this._contract().balanceOf(address)
  }

  async balanceAt(address: string, block: string): Promise<BigNumber> {
    return this._contract().balanceOfAt(address, block)
  }

  _contract(): Contract {
    return new Contract(this.id, miniMeAbi, this.#ethersProvider)
  }
}
