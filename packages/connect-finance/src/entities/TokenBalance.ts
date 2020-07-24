import { Address } from '@aragon/connect-types'

export interface TokenBalanceData {
  id: string
  token: Address
  balance: string
}

export default class TokenBalance implements TokenBalanceData {
  readonly id!: string
  readonly token!: string
  readonly balance!: string

  constructor(data: TokenBalanceData) {
    this.id = data.id
    this.token = data.token
    this.balance = data.balance
  }
}
