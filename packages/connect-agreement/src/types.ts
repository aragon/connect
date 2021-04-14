import {
  SubscriptionCallback,
  SubscriptionHandler,
} from '@aragon/connect-types'

import Signer from './models/Signer'
import Signature from './models/Signature'
import Version from './models/Version'
import DisputableApp from './models/DisputableApp'
import CollateralRequirement from './models/CollateralRequirement'
import Action from './models/Action'
import Staking from './models/Staking'
import StakingMovement from './models/StakingMovement'
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
  currentCollateralRequirementId: string
}

export interface CollateralRequirementData {
  id: string
  disputableAppId: string
  tokenId: string
  tokenSymbol: string
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

export interface ActionData {
  id: string
  agreementId: string
  disputableId: string
  disputableActionId: string
  collateralRequirementId: string
  versionId: string
  context: string
  createdAt: string
}

export interface StakingData {
  id: string
  user: string
  tokenId: string
  tokenSymbol: string
  tokenDecimals: string
  available: string
  locked: string
  challenged: string
  total: string
}

export interface StakingMovementData {
  id: string
  tokenId: string
  tokenSymbol: string
  tokenDecimals: string
  stakingId: string
  agreementId: string
  amount: string
  actionId: string
  disputableAddress: string
  disputableActionId: string
  actionState: string
  collateralState: string
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
  disputableApps(
    agreement: string,
    first: number,
    skip: number
  ): Promise<DisputableApp[]>
  onDisputableApps(
    agreement: string,
    first: number,
    skip: number,
    callback: SubscriptionCallback<DisputableApp[]>
  ): SubscriptionHandler
  signer(signerId: string): Promise<Signer | null>
  onSigner(
    signerId: string,
    callback: SubscriptionCallback<Signer | null>
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
  collateralRequirement(collateralRequirementId: string): Promise<CollateralRequirement>
  onCollateralRequirement(
    collateralRequirementId: string,
    callback: SubscriptionCallback<CollateralRequirement>
  ): SubscriptionHandler
  action(actionId: string): Promise<Action | null>
  onAction(
    actionId: string,
    callback: SubscriptionCallback<Action | null>
  ): SubscriptionHandler
  staking(stakingId: string): Promise<Staking | null>
  onStaking(
    stakingId: string,
    callback: SubscriptionCallback<Staking | null>
  ): SubscriptionHandler
  stakingMovements(
    stakingId: string,
    agreement: string,
    first: number,
    skip: number
  ): Promise<StakingMovement[]>
  onStakingMovements(
    stakingId: string,
    agreement: string,
    first: number,
    skip: number,
    callback: SubscriptionCallback<StakingMovement[]>
  ): SubscriptionHandler
  ERC20(tokenAddress: string): Promise<ERC20>
  onERC20(
    tokenAddress: string,
    callback: SubscriptionCallback<ERC20>
  ): SubscriptionHandler
}
