import { Address } from '@aragon/connect-types'

import { TransactionData } from '../types'

export default class Transaction {
  readonly data: string
  readonly from: Address
  readonly to: Address

  constructor(data: TransactionData) {
    this.data = data.data
    this.from = data.from
    this.to = data.to
  }
}
