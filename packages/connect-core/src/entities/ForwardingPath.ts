import { providers as ethersProviders } from 'ethers'

import Transaction from './Transaction'
import { buildApprovePretransaction } from '../utils/transactions'
import {
  ForwardingPathData,
  AppOrAddress,
  StepDescribed,
  TokenData,
} from '../types'
import ForwardingPathDescription from '../utils/descriptor'

export default class ForwardingPath {
  #provider: ethersProviders.Provider
  readonly destination: AppOrAddress
  readonly description: StepDescribed[]
  readonly transactions: Transaction[]

  constructor(data: ForwardingPathData, provider: ethersProviders.Provider) {
    this.#provider = provider
    this.destination = data.destination
    this.description = data.description
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
  describe(): ForwardingPathDescription {
    return new ForwardingPathDescription(this.description)
  }

  async applyApprovePretransaction(tokenData: TokenData) {
    const pretransaction = await buildApprovePretransaction(
      this.transactions[0],
      tokenData,
      this.#provider
    )
    if (pretransaction) {
      this.transactions.push(pretransaction)
    }
  }
}
