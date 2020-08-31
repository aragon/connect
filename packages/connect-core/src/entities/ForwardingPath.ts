import { ethers } from 'ethers'

import App from './App'
import Transaction from './Transaction'
import {
  AppOrAddress,
  ForwardingPathData,
  ForwardingPathDescriptionData,
  PostProcessDescription,
} from '../types'
import { describeForwardingPath } from '../utils/description'

export default class ForwardingPath {
  #provider: ethers.providers.Provider
  readonly apps: App[]
  readonly destination: App
  readonly transactions: Transaction[]

  constructor(data: ForwardingPathData, provider: ethers.providers.Provider) {
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

type ForwardingPathDescriptionTreeEntry =
  | AppOrAddress
  | [AppOrAddress, ForwardingPathDescriptionTreeEntry[]]

export type ForwardingPathDescriptionTree = ForwardingPathDescriptionTreeEntry[]

export class ForwardingPathDescription {
  readonly apps: App[]
  readonly describeSteps: PostProcessDescription[]

  constructor(data: ForwardingPathDescriptionData) {
    this.apps = data.apps
    this.describeSteps = data.describeSteps
  }

  // Return a tree that can get used to render the path.
  tree(): ForwardingPathDescriptionTree {
    // TODO:
    return []
  }

  // Renders the forwarding path description as text
  toString(): string {
    return this.tree().toString()
  }

  // TBD: a utility that makes it easy to render the tree,
  // e.g. as a nested list in HTML or React.
  reduce(callback: Function): any {}
}
