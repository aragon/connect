import { SubscriptionHandler } from '@aragon/connect-types'

import Signer from './models/Signer'
import Signature from './models/Signature'
import Version from './models/Version'

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
  onAgreement(agreement: string, callback: Function): SubscriptionHandler
  currentVersion(agreement: string): Promise<Version>
  onCurrentVersion(agreement: string, callback: Function): SubscriptionHandler
  version(versionId: string): Promise<Version>
  onVersion(versionId: string, callback: Function): SubscriptionHandler
  versions(agreement: string, first: number, skip: number): Promise<Version[]>
  onVersions(agreement: string, first: number, skip: number, callback: Function): SubscriptionHandler
  signer(signerId: string): Promise<Signer>
  onSigner(signerId: string, callback: Function): SubscriptionHandler
  signatures(signerId: string, first: number, skip: number): Promise<Signature[]>
  onSignatures(signerId: string, first: number, skip: number, callback: Function): SubscriptionHandler
}
