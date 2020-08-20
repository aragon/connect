import TransactionRequest from './TransactionRequest'
import App from '../entities/App'
import { TransactionPathData } from '../types'

export default class TransactionPath {
  readonly apps!: App[]
  readonly destination!: App
  readonly forwardingFeePretransaction?: TransactionRequest
  readonly transactions!: TransactionRequest[]

  constructor(data: TransactionPathData) {
    this.apps = data.apps
    this.destination = data.destination
    this.forwardingFeePretransaction = data.forwardingFeePretransaction
    this.transactions = data.transactions
  }
}
