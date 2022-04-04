import { CastData, VoterData } from '../types'

export default class Cast {
  readonly id: string
  readonly vote: string
  readonly voter: VoterData
  readonly supports: boolean
  readonly stake: string
  readonly createdAt: string

  constructor(data: CastData) {
    this.id = data.id
    this.vote = data.vote
    this.voter = data.voter
    this.supports = data.supports
    this.stake = data.stake
    this.createdAt = data.createdAt
  }
}
