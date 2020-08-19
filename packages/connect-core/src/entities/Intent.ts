import { ethers } from 'ethers'

import ForwardingPath from './ForwardingPath'
import Organization from './Organization'
import Transaction from './Transaction'
import { PathOptions, IntentData } from '../types'
import { calculateTransactionPath } from '../utils/path/calculatePath'

export default class Intent {
  #org: Organization
  #provider: ethers.providers.Provider
  readonly appAddress: string
  readonly functionName: string
  readonly functionArgs: any[]

  constructor(
    data: IntentData,
    org: Organization,
    provider: ethers.providers.Provider
  ) {
    this.#org = org
    this.#provider = provider
    this.appAddress = data.appAddress
    this.functionName = data.functionName
    this.functionArgs = data.functionArgs
  }

  // Retrieve a single forwarding path. Defaults to the shortest one.
  async path({ actAs, path }: PathOptions): Promise<ForwardingPath> {
    const apps = await this.#org.apps()

    // Get the destination app
    const destination = apps.find((app) => app.address == this.appAddress)
    if (!destination) {
      throw new Error(
        `Destination (${this.appAddress}) is not an installed app`
      )
    }

    const transactions = await calculateTransactionPath(
      actAs,
      destination,
      this.functionName,
      this.functionArgs,
      apps,
      this.#provider
    )

    return new ForwardingPath(
      {
        apps: apps.filter((app) =>
          transactions
            .map((tx) => tx.to)
            .some((address) => address === app.address)
        ),
        destination,
        transactions,
      },
      this.#provider
    )
  }

  // Retrieve the different possible forwarding paths.
  async paths({ actAs, path }: PathOptions): Promise<ForwardingPath[]> {
    // TODO:
    return [await this.path({ actAs, path })]
  }

  // A list of transaction requests ready to get signed.
  async transactions(options: PathOptions): Promise<Transaction[]> {
    return (await this.path(options)).transactions
  }

  // Lets consumers pass a callback to sign any number of transactions.
  // This is similar to calling transactions() and using a loop, but shorter.
  // It returns the value returned by the library, usually a transaction receipt.
  async sign<Receipt>(
    callback: (tx: Transaction) => Promise<Receipt>,
    options: PathOptions
  ): Promise<Receipt[]> {
    const txs = await this.transactions(options)
    return Promise.all(txs.map(async (tx) => await callback(tx)))
  }
}
