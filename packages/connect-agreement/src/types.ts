import {
  SubscriptionCallback,
  SubscriptionHandler,
} from '@aragon/connect-types'

import Signer from './models/Signer'
import Signature from './models/Signature'
import Version from './models/Version'
import DisputableApp from './models/DisputableApp'
import CollateralRequirement from './models/CollateralRequirement'
import ERC20 from './models/ERC20'

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

export interface DisputableAppData {
  id: string
  address: string
  agreementId: string
  activated: boolean
  collateralRequirementId: string
}

export interface CollateralRequirementData {
  id: string
  disputableAppId: string
  tokenId: string
  tokenDecimals: string
  actionAmount: string
  challengeAmount: string
  challengeDuration: string
}

export interface ERC20Data {
  id: string
  name: string
  symbol: string
  decimals: string
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
  onAgreement(
    agreement: string,
    callback: SubscriptionCallback<AgreementData>
  ): SubscriptionHandler
  currentVersion(agreement: string): Promise<Version>
  onCurrentVersion(
    agreement: string,
    callback: SubscriptionCallback<Version>
  ): SubscriptionHandler
  version(versionId: string): Promise<Version>
  onVersion(
    versionId: string,
    callback: SubscriptionCallback<Version>
  ): SubscriptionHandler
  versions(agreement: string, first: number, skip: number): Promise<Version[]>
  onVersions(
    agreement: string,
    first: number,
    skip: number,
    callback: SubscriptionCallback<Version[]>
  ): SubscriptionHandler
  disputableApps(agreement: string, first: number, skip: number): Promise<DisputableApp[]>
  onDisputableApps(
    agreement: string,
    first: number,
    skip: number,
    callback: SubscriptionCallback<DisputableApp[]>
  ): SubscriptionHandler
  signer(signerId: string): Promise<Signer>
  onSigner(
    signerId: string,
    callback: SubscriptionCallback<Signer>
  ): SubscriptionHandler
  signatures(
    signerId: string,
    first: number,
    skip: number
  ): Promise<Signature[]>
  onSignatures(
    signerId: string,
    first: number,
    skip: number,
    callback: SubscriptionCallback<Signature[]>
  ): SubscriptionHandler
  collateralRequirement(disputableAppId: string): Promise<CollateralRequirement>
  onCollateralRequirement(
     disputableAppId: string, 
	 callback: SubscriptionCallback<CollateralRequirement>
  ): SubscriptionHandler
  ERC20(tokenAddress: string): Promise<ERC20>
  onERC20(tokenAddress: string, callback: SubscriptionCallback<ERC20>): SubscriptionHandler
}
