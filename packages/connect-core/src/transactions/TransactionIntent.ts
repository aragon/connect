import { ethers } from 'ethers'

import TransactionPath from './TransactionPath'
import TransactionRequest from './TransactionRequest'
import Organization from '../entities/Organization'
import { TransactionIntentData } from '../types'
import { calculateTransactionPath } from '../utils/path/calculatePath'
import { describeTransactionPath } from '../utils/descriptions'

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
      path,
    } = await calculateTransactionPath(
      account,
      this.contractAddress,
      this.functionName,
      this.functionArgs,
      apps,
      this.#provider
    )

    const describedPath = await describeTransactionPath(
      path,
      apps,
      this.#provider
    )

    return new TransactionPath({
      apps: apps.filter((app) =>
        path
          .map((transaction) => transaction.to)
          .some((address) => address === app.address)
      ),
      destination: apps.find((app) => app.address == this.contractAddress)!,
      forwardingFeePretransaction,
      transactions: describedPath,
    })
  }

  async transactions(
    account: string,
    options?: { as: string; path?: string[] }
  ): Promise<TransactionRequest[]> {
    return (await this.paths(account, options)).transactions
  }
}
