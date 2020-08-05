import { CastData } from '../types'

export default class Cast {
  readonly id!: string
  readonly voteId!: string
  readonly voter!: string
  readonly supports!: boolean

  constructor(data: CastData) {
    this.id = data.id
    this.voteId = data.voteId
    this.voter = data.voter
    this.supports = data.supports
  }
}
