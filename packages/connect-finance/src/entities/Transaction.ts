import { Address } from '@aragon/connect-types'

export interface TransactionData {
  id: string
  token: Address
  entity: Address
  isIncoming: boolean
  amount: string
  date: string
  reference: string
}

export default class Transaction implements TransactionData {
  readonly id: string
  readonly token: Address
  readonly entity: Address
  readonly isIncoming: boolean
  readonly amount: string
  readonly date: string
  readonly reference: string

  constructor(data: TransactionData) {
    this.id = data.id
    this.token = data.token
    this.entity = data.entity
    this.isIncoming = data.isIncoming
    this.amount = data.amount
    this.date = data.date
    this.reference = data.reference
  }
}
