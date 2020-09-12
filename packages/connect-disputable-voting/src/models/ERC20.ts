import { miniMeAbi } from '@aragon/connect-core'
import { BigNumber, Contract, providers as ethersProviders } from 'ethers'

import { ERC20Data } from '../types'

export default class ERC20 {
  #provider: ethersProviders.Provider

  readonly id: string
  readonly name: string
  readonly symbol: string
  readonly decimals: string

  constructor(data: ERC20Data, provider: ethersProviders.Provider) {
    this.#provider = provider

    this.id = data.id
    this.name = data.name
    this.symbol = data.symbol
    this.decimals = data.decimals
  }

  async getBalance(address: string): Promise<BigNumber> {
    return this._contract().balanceOf(address)
  }

  async getBalanceAt(address: string, block: string): Promise<BigNumber> {
    return this._contract().balanceOfAt(address, block)
  }

  _contract(): Contract {
    return new Contract(this.id, miniMeAbi, this.#provider)
  }
}
