import { SubscriptionHandler } from '@aragon/connect-types'

import Signer from './entities/Signer'
import Signature from './entities/Signature'
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

export interface SignerData {
  id: string
  address: string
  agreementId: string
}

export interface SignatureData {
  id: string
  signerId: string
  versionId: string
  createdAt: string
}

export interface IAgreementConnector {
  disconnect(): Promise<void>
  agreement(agreement: string): Promise<AgreementData>
  currentVersion(agreement: string): Promise<Version>
  onCurrentVersion(agreement: string, callback: Function): SubscriptionHandler
  version(versionId: string): Promise<Version>
  onVersion(versionId: string, callback: Function): SubscriptionHandler
  versions(agreement: string, first: number, skip: number): Promise<Version[]>
  onVersions(agreement: string, callback: Function): SubscriptionHandler
  signer(signerId: string): Promise<Signer>
  onSigner(signerId: string, callback: Function): SubscriptionHandler
  signatures(signerId: string, first: number, skip: number): Promise<Signature[]>
  onSignatures(signerId: string, callback: Function): SubscriptionHandler
}
