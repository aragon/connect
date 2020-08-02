import { SubscriptionHandler } from '@aragon/connect-types'

import Version from './entities/Version'

export interface AgreementData {
  id: string
  dao: string
  stakingFactory: string
  currentVersionId: string
}

export interface VersionData {
  id: string
  versionId: string
  content: string
  title: string
  arbitrator: string
  appFeesCashier: string
  effectiveFrom: string
}

export interface IAgreementConnector {
  disconnect(): Promise<void>
  agreement(agreement: string): Promise<AgreementData>
  currentVersion(agreement: string): Promise<Version>
  onCurrentVersion(agreement: string, callback: Function): SubscriptionHandler
  version(agreement: string, versionId: string): Promise<Version>
  onVersion(agreement: string, versionId: string, callback: Function): SubscriptionHandler
  versions(agreement: string, first: number, skip: number): Promise<Version[]>
  onVersions(agreement: string, callback: Function): SubscriptionHandler
}
