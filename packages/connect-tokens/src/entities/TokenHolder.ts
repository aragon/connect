import { Address } from '@aragon/connect-types'

export interface TokenHolderData {
  id: string
  address: Address
  balance: string
}

export default class TokenHolder {
  readonly id: string
  readonly address: Address
  readonly balance: string

  constructor(data: TokenHolderData) {
    this.id = data.id
    this.address = data.address
    this.balance = data.balance
  }
}
