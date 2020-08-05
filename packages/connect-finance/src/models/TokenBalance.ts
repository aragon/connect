import { TokenBalanceData } from '../types'

export default class TokenBalance {
  readonly id: string
  readonly token: string
  readonly balance: string

  constructor(data: TokenBalanceData) {
    this.id = data.id
    this.token = data.token
    this.balance = data.balance
  }
}
