import TransactionRequest from './TransactionRequest'
import Application from '../entities/Application'

export interface TransactionPathData {
  apps: Application[]
  destination: Application
  forwardingFeePretransaction?: TransactionRequest
  transactions: TransactionRequest[]
}

export default class TransactionPath {
  readonly apps!: Application[]
  readonly destination!: Application
  readonly forwardingFeePretransaction?: TransactionRequest
  readonly transactions!: TransactionRequest[]

  constructor(data: TransactionPathData) {
    this.apps = data.apps
    this.destination = data.destination
    this.forwardingFeePretransaction = data.forwardingFeePretransaction
    this.transactions = data.transactions
  }
}
