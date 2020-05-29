import Entity from "./Entity";
import Cast from './Cast'
import VotingConnectorTheGraph from "../connector";

export interface VoteData {
  id: string
  creator: string
  metadata: string
  open: boolean
  executed: boolean
  startDate: string
  snapshotBlock: string
  supportRequiredPct: string
  minAcceptQuorum: string
  yea: string
  nay: string
  votingPower: string
  script: string
}

export default class Vote extends Entity implements VoteData {
  readonly id!: string
  readonly creator!: string
  readonly metadata!: string
  readonly open!: boolean
  readonly executed!: boolean
  readonly startDate!: string
  readonly snapshotBlock!: string
  readonly supportRequiredPct!: string
  readonly minAcceptQuorum!: string
  readonly yea!: string
  readonly nay!: string
  readonly votingPower!: string
  readonly script!: string

  constructor(data: VoteData, connector: VotingConnectorTheGraph) {
    super(connector)

    Object.assign(this, data)
  }

  async casts(): Promise<Cast[]> {
    return this._connector.castsForVote(this.id)
  }
}