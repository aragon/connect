import { ethers } from 'ethers'

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

    Object.assign(this, data)
  }

  async paths(
    account: string,
    options?: { as?: string; path?: string[] }
  ): Promise<TransactionPath> {
    const apps = await this.#org.apps()
    const destination = this.contractAddress

    const transactions = await calculateTransactionPath(
      account,
      destination,
      this.functionName,
      this.functionArgs,
      apps,
      this.#provider
    )

    const transactionsDescibed = await describeTransactionPath(
      transactions,
      apps,
      this.#provider
    )

    // Include chainId and create Transaction Request objects
    const chainId = (await this.#provider.getNetwork()).chainId
    const transactionsRequests = transactionsDescibed.map((transaction) => {
      return new TransactionRequest({
        ...transaction,
        chainId,
      })
    })

    const appsOnPath = transactions.map((transaction) => transaction.to)

    return new TransactionPath({
      apps: apps.filter((app) =>
        appsOnPath.some((address) => address === app.address)
      ),
      destination: apps.find((app) => app.address == destination) as Application,
      transactions: transactionsRequests,
    })
  }

  async transactions(
    account: string,
    options?: { as: string; path?: string[] }
  ): Promise<TransactionRequest[]> {
    return (await this.paths(account, options)).transactions
  }
}
