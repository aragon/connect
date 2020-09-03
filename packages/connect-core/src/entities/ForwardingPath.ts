import { providers as ethersProviders } from 'ethers'

import { buildApprovePretransaction } from '../utils/transactions'
import {
  ForwardingPathData,
  AppOrAddress,
  StepDescribed,
  TokenData,
  TransactionData,
} from '../types'
import ForwardingPathDescription, {
  describePath,
} from '../utils/descriptor/index'
import App from './App'
import Transaction from './Transaction'

export default class ForwardingPath {
  #installedApps: App[]
  #provider: ethersProviders.Provider
  readonly destination: AppOrAddress
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

  async applyPretransaction(
    transaction: TransactionData,
    tokenData: TokenData
  ) {
    let pretransaction
    if (tokenData) {
      pretransaction = await buildApprovePretransaction(
        this.transactions[0],
        tokenData,
        this.#provider
      )
    }
    pretransaction = new Transaction(transaction)

    this.transactions.push(pretransaction)
  }
}
