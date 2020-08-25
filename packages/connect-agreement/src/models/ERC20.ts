import { ERC20Data } from '../types'

export default class ERC20 {
  readonly id: string
  readonly name: string
  readonly symbol: string
  readonly decimals: string

  constructor(data: ERC20Data) {
    this.id = data.id
    this.name = data.name
    this.symbol = data.symbol
    this.decimals = data.decimals
  }
}
