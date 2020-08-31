import App from '../entities/App'
import Transaction from '../entities/Transaction'
import { TransactionPathData } from '../types'

export default class TransactionPath {
  readonly apps!: App[]
  readonly destination!: App
  readonly forwardingFeePretransaction?: Transaction
  readonly transactions!: Transaction[]

  constructor(data: TransactionPathData) {
    this.apps = data.apps
    this.destination = data.destination
    this.forwardingFeePretransaction = data.forwardingFeePretransaction
    this.transactions = data.transactions
  }
}
