import { Address } from '@aragon/connect-types'

import { TransactionData } from '../types'

export default class Transaction {
  readonly data: string
  readonly from: Address
  readonly to: Address

  constructor(data: TransactionData) {
    if (!data.to) {
      throw new Error(`Could not cosntruct trasanction: missing 'to'`)
    }
    if (!data.from) {
      throw new Error(`Could not cosntruct trasanction: missing 'from'`)
    }
    if (!data.data) {
      throw new Error(`Could not cosntruct trasanction: missing 'data'`)
    }
    this.data = data.data
    this.from = data.from
    this.to = data.to
  }
}
