import TransactionDescribed from './TransactionDescribed'
import TransactionRequest from './TransactionRequest'
import Application from '../entities/Application'

export interface TransactionPathData {
  apps: Application[]
  transactionsDescribed: TransactionDescribed[]
  destination: Application
  forwardingFeePretransaction?: TransactionRequest
  transactions: TransactionRequest[]
}

export default class TransactionPath {
  readonly apps!: Application[]
  readonly transactionsDescribed!: TransactionDescribed[]
  readonly destination!: Application
  readonly forwardingFeePretransaction?: TransactionRequest
  readonly transactions!: TransactionRequest[]

  constructor(data: TransactionPathData) {
    this.apps = data.apps
    this.transactionsDescribed = data.transactionsDescribed
    this.destination = data.destination
    this.forwardingFeePretransaction = data.forwardingFeePretransaction
    this.transactions = data.transactions
  }
}
