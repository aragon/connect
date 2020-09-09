import { providers as ethersProviders } from 'ethers'

import { buildApprovePreTransactions } from '../utils/transactions'
import {
  ForwardingPathData,
  StepDescribed,
  TokenData,
  TransactionData,
} from '../types'
import ForwardingPathDescription, {
  describePath,
} from '../utils/descriptor/index'
import App from './App'
import Transaction from './Transaction'

const normalizePreTransactions = (preTransactions: (Transaction | TransactionData)[]): Transaction[] => {
  return preTransactions.map((preTransaction: Transaction | TransactionData) =>
    (preTransaction instanceof Transaction) ? preTransaction : new Transaction(preTransaction)
  )
}

export default class ForwardingPath {
  #installedApps: App[]
  #provider: ethersProviders.Provider
  readonly destination: App
  readonly path: Transaction[]
  readonly transactions: Transaction[]

  constructor(
    data: ForwardingPathData,
    installedApps: App[],
    provider: ethersProviders.Provider
  ) {
    this.#installedApps = installedApps
    this.#provider = provider
    this.destination = data.destination
    this.path = data.path
    this.transactions = data.transactions
  }

  // Lets consumers pass a callback to sign any number of transactions.
  // This is similar to calling transactions() and using a loop, but shorter.
  // It returns the value returned by the library, usually a transaction receipt.
  async sign<Receipt>(
    callback: (tx: Transaction) => Promise<Receipt>
  ): Promise<Receipt[]> {
    return Promise.all(this.transactions.map(async (tx) => await callback(tx)))
  }

  // Return a description of the forwarding path, to be rendered.
  async describe(): Promise<ForwardingPathDescription> {
    let description: StepDescribed[] = []
    if (this.path.length > 0) {
      try {
        description = await describePath(
          this.path,
          this.#installedApps,
          this.#provider
        )
      } catch (_) {}
    }

    return new ForwardingPathDescription(description, this.#installedApps)
  }

  // Build a token allowance pre-transaction
  async buildApprovePreTransactions(
    tokenData: TokenData
  ): Promise<Transaction[]> {
    return buildApprovePreTransactions(
      this.transactions[0],
      tokenData,
      this.#provider
    )
  }

  // Apply a pretransaction to the path
  applyPreTransactions(preTransactions: (Transaction | TransactionData)[]): void {
    normalizePreTransactions(preTransactions)
      .reverse()
      .filter(preTransaction => !!preTransaction)
      .forEach(preTransaction => this.transactions.unshift(preTransaction))
  }
}
