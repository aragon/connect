import TransactionRequest from './TransactionRequest'
import App from '../entities/App'

export interface TransactionPathData {
  apps: App[]
  destination: App
  transactions: TransactionRequest[]
}

export default class TransactionPath {
  readonly apps!: App[]
  readonly destination!: App
  readonly transactions!: TransactionRequest[]

  constructor(data: TransactionPathData) {
    Object.assign(this, data)
  }
}
