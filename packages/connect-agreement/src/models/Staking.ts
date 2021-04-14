import { subscription } from '@aragon/connect-core'
import { SubscriptionCallback, SubscriptionResult } from '@aragon/connect-types'

import ERC20 from './ERC20'
import { formatBn } from '../helpers'
import { StakingData, IAgreementConnector } from '../types'

export default class Staking {
  #connector: IAgreementConnector

  readonly id: string
  readonly user: string
  readonly tokenId: string
  readonly tokenSymbol: string
  readonly tokenDecimals: string
  readonly available: string
  readonly locked: string
  readonly challenged: string
  readonly total: string

  constructor(data: StakingData, connector: IAgreementConnector) {
    this.#connector = connector

    this.id = data.id
    this.user = data.user
    this.tokenId = data.tokenId
    this.tokenSymbol = data.tokenSymbol
    this.tokenDecimals = data.tokenDecimals
    this.available = data.available
    this.locked = data.locked
    this.challenged = data.challenged
    this.total = data.total
  }

  async disconnect() {
    await this.#connector.disconnect()
  }

  get formattedTotalAmount(): string {
    return formatBn(this.total, this.tokenDecimals)
  }

  get formattedAvailableAmount(): string {
    return formatBn(this.available, this.tokenDecimals)
  }

  get formattedLockedAmount(): string {
    return formatBn(this.locked, this.tokenDecimals)
  }

  get formattedChallengedAmount(): string {
    return formatBn(this.challenged, this.tokenDecimals)
  }

  async token(): Promise<ERC20> {
    return this.#connector.ERC20(this.tokenId)
  }

  onToken(callback?: SubscriptionCallback<ERC20>): SubscriptionResult<ERC20> {
    return subscription<ERC20>(callback, (callback) =>
      this.#connector.onERC20(this.tokenId, callback)
    )
  }
}
