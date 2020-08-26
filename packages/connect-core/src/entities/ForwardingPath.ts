import { providers as ethersProviders } from 'ethers'

import App from './App'
import Transaction from './Transaction'
import {
  AppOrAddress,
  ForwardingPathData,
  ForwardingPathDescriptionData,
  PostProcessDescription,
} from '../types'
import { describeForwardingPath } from '../utils/descriptor/describe'

export default class ForwardingPath {
  #provider: ethersProviders.Provider
  readonly apps: App[]
  readonly destination: App
  readonly transactions: Transaction[]

  constructor(data: ForwardingPathData, provider: ethersProviders.Provider) {
    this.#provider = provider
    this.apps = data.apps
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
    // TODO: Make sure we are safe to only provide the apps on the path here
    return describeForwardingPath(this.transactions, this.apps, this.#provider)
  }

  // Return a description of the forwarding path, as text.
  // Shorthand for .describe().toString()
  toString(): string {
    return this.describe().toString()
  }
}
