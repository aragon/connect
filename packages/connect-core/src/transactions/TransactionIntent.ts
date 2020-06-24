import { ethers } from 'ethers'

import TransactionDescribed from './TransactionDescribed'
import TransactionPath from './TransactionPath'
import TransactionRequest from './TransactionRequest'
import Application from '../entities/Application'
import Organization from '../entities/Organization'
import { calculateTransactionPath } from '../utils/path/calculatePath'
import { describeTransactionPath } from '../utils/path/describePath'

export interface TransactionIntentData {
  contractAddress: string
  functionName: string
  functionArgs: any[]
}

export default class TransactionIntent {
  readonly contractAddress!: string
  readonly functionName!: string
  readonly functionArgs!: any[]

  #org: Organization
  #provider: ethers.providers.Provider

  constructor(
    data: TransactionIntentData,
    org: Organization,
    provider: ethers.providers.Provider
  ) {
    this.#org = org
    this.#provider = provider

    this.contractAddress = data.contractAddress
    this.functionArgs = data.functionArgs
    this.functionName = data.functionName
  }

  async paths(
    account: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: { as?: string; path?: string[] }
  ): Promise<TransactionPath> {
    const apps = await this.#org.apps()

    const {
      forwardingFeePretransaction,
      transactions,
    } = await calculateTransactionPath(
      account,
      this.contractAddress,
      this.functionName,
      this.functionArgs,
      apps,
      this.#provider
    )

    const transactionsDescribed = await describeTransactionPath(
      transactions,
      apps,
      this.#provider
    )

    const appsOnPath = transactions.map(transaction => transaction.to)

    return new TransactionPath({
      apps: apps.filter(app =>
        appsOnPath.some(address => address === app.address)
      ),
      transactionsDescribed: transactionsDescribed.map(
        transaction => new TransactionDescribed(transaction)
      ),
      destination: apps.find(
        app => app.address == this.contractAddress
      ) as Application,
      forwardingFeePretransaction,
      transactions: transactions.map(
        transaction => new TransactionRequest(transaction)
      ),
    })
  }

  async transactions(
    account: string,
    options?: { as: string; path?: string[] }
  ): Promise<TransactionRequest[]> {
    return (await this.paths(account, options)).transactions
  }
}
