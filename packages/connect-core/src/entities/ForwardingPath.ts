import { providers as ethersProviders } from 'ethers'

import { buildApprovePretransaction } from '../utils/transactions'
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

const normalizePretransaction = (
  pretransaction: Transaction | TransactionData
): Transaction => {
  if (pretransaction instanceof Transaction) {
    return pretransaction
  }
  return new Transaction(pretransaction)
}

export default class ForwardingPath {
  #installedApps: App[]
  #provider: ethersProviders.Provider
  readonly destination: App
  readonly transactions: Transaction[]

  constructor(
    data: ForwardingPathData,
    installedApps: App[],
    provider: ethersProviders.Provider
  ) {
    this.#installedApps = installedApps
    this.#provider = provider
    this.destination = data.destination
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
    if (this.transactions.length > 0) {
      try {
        description = await describePath(
          this.transactions,
          this.#installedApps,
          this.#provider
        )
      } catch (_) {}
    }

    return new ForwardingPathDescription(description, this.#installedApps)
  }

  // Build a token allowance pretransactionn
  async buildApprovePretransaction(
    tokenData: TokenData
  ): Promise<Transaction | undefined> {
    return buildApprovePretransaction(
      this.transactions[0],
      tokenData,
      this.#provider
    )
  }

  // Apply a pretransaction to the path
  applyPretransaction(pretransaction: Transaction | TransactionData): void {
    normalizePretransaction(pretransaction)
    this.transactions.push(pretransaction)
  }
}
