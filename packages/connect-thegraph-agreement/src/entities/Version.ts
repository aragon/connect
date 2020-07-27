import Entity from './AgreementEntity'
import VersionConnectorTheGraph from '../connector'

export interface VersionData {
  id: string
  versionId: string
  content: string
  title: string
  arbitrator: string
  appFeesCashier: string
  effectiveFrom: string
}

export default class Version extends Entity implements VersionData {
  readonly id!: string
  readonly versionId!: string
  readonly content!: string
  readonly title!: string
  readonly arbitrator!: string
  readonly appFeesCashier!: string
  readonly effectiveFrom!: string

  constructor(data: VersionData, connector: VersionConnectorTheGraph) {
    super(connector)
    Object.assign(this, data)
  }
}
