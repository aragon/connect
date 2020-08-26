import { IDisputableVotingConnector, VoterData } from '../types'

export default class Voter {
  #connector: IDisputableVotingConnector

  readonly id: string
  readonly votingId: string
  readonly address: string
  readonly representative: string

  constructor(data: VoterData, connector: IDisputableVotingConnector) {
    this.#connector = connector

    this.id = data.id
    this.votingId = data.votingId
    this.address = data.address
    this.representative = data.representative
  }
}
