import TransactionRequest from './TransactionRequest'
import Application from '../entities/Application'

export interface TransactionPathData {
  apps: Application[]
  destination: Application
  transactions: TransactionRequest[]
}

export default class TransactionPath {
  readonly apps!: Application[]
  readonly destination!: Application
  readonly transactions!: TransactionRequest[]

  constructor(data: TransactionPathData) {
    Object.assign(this, data)
  }
}
