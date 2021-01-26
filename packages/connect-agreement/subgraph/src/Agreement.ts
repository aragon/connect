import { ethereum, BigInt, Address, log } from '@graphprotocol/graph-ts'

import { ERC20 } from '../generated/schema'
import { ERC20 as ERC20Contract } from '../generated/templates/Agreement/ERC20'
import { createAgreementStakingMovement } from './Staking'
import { Staking as StakingTemplate } from '../generated/templates'
import { StakingFactory as StakingFactoryContract } from '../generated/templates/Agreement/StakingFactory'
import { DisputableVoting as DisputableVotingTemplate } from '../generated/templates'
import { DisputableAragonApp as DisputableAragonAppContract } from '../generated/templates/DisputableVoting/DisputableAragonApp'
import { Agreement, Action, Signature, Version, Disputable, Challenge, Dispute, Evidence, Signer, CollateralRequirement, ArbitratorFee } from '../generated/schema'
import {
  Agreement as AgreementContract,
  ActionSubmitted,
  ActionChallenged,
  ActionSettled,
  ActionDisputed,
  ActionAccepted,
  ActionVoided,
  ActionRejected,
  ActionClosed,
  EvidenceSubmitted,
  SettingChanged,
  Signed,
  DisputableAppActivated,
  DisputableAppDeactivated,
  CollateralRequirementChanged
} from '../generated/templates/Agreement/Agreement'

/* eslint-disable @typescript-eslint/no-use-before-define */

export function handleSettingChanged(event: SettingChanged): void {
  const agreementApp = AgreementContract.bind(event.address)
  const settingData = agreementApp.getSetting(event.params.settingId)

  const agreement = loadOrCreateAgreement(event.address)
  const currentVersionId = buildVersionId(event.address, event.params.settingId)
  const version = new Version(currentVersionId)
  version.agreement = event.address.toHexString()
  version.versionId = event.params.settingId
  version.arbitrator = settingData.value0
  version.appFeesCashier = settingData.value1
  version.title = settingData.value2
  version.content = settingData.value3
  version.effectiveFrom = event.block.timestamp
  version.save()

  agreement.currentVersion = currentVersionId
  agreement.save()
}

export function handleSigned(event: Signed): void {
  const signer = loadOrCreateSigner(event.address, event.params.signer)
  signer.save()

  const signature = new Signature(event.transaction.hash.toHexString())
  signature.signer = buildSignerId(event.address, event.params.signer)
  signature.version = buildVersionId(event.address, event.params.settingId)
  signature.createdAt = event.block.timestamp
  signature.save()
}

export function handleDisputableAppActivated(event: DisputableAppActivated): void {
  const agreementApp = AgreementContract.bind(event.address)
  const disputableData = agreementApp.getDisputableInfo(event.params.disputable)
  const disputable = loadOrCreateDisputable(event.address, event.params.disputable)
  disputable.activated = true
  disputable.currentCollateralRequirement = buildCollateralRequirementId(event.address, event.params.disputable, disputableData.value1)
  disputable.save()

  updateCollateralRequirement(event.address, event.params.disputable, disputableData.value1)
}

export function handleDisputableAppDeactivated(event: DisputableAppDeactivated): void {
  const disputable = loadOrCreateDisputable(event.address, event.params.disputable)
  disputable.activated = false
  disputable.save()
}

export function handleCollateralRequirementChanged(event: CollateralRequirementChanged): void {
  updateCollateralRequirement(event.address, event.params.disputable, event.params.collateralRequirementId)
}

export function handleActionSubmitted(event: ActionSubmitted): void {
  const actionId = buildActionId(event.address, event.params.actionId)
  const agreementApp = AgreementContract.bind(event.address)

  const action = new Action(actionId)
  const actionData = agreementApp.getAction(event.params.actionId)
  action.agreement = event.address.toHexString()
  action.actionId = event.params.actionId
  action.disputable = buildDisputableId(event.address, actionData.value0)
  action.disputableActionId = actionData.value1
  action.collateralRequirement = buildCollateralRequirementId(event.address, actionData.value0, actionData.value2)
  action.version = buildVersionId(event.address, actionData.value3)
  action.submitter = buildSignerId(event.address, actionData.value4)
  action.closed = actionData.value5
  action.context = actionData.value6
  action.createdAt = event.block.timestamp
  action.save()

  createAgreementStakingMovement(event.address, event.params.actionId, 'new', event)
}

export function handleActionClosed(event: ActionClosed): void {
  const action = Action.load(buildActionId(event.address, event.params.actionId))!
  action.closed = true
  action.save()

  createAgreementStakingMovement(event.address, event.params.actionId, 'closed', event)
}

export function handleActionChallenged(event: ActionChallenged): void {
  const actionId = buildActionId(event.address, event.params.actionId)
  const challengeId = buildChallengeId(event.address, event.params.challengeId)
  const agreementApp = AgreementContract.bind(event.address)

  const action = Action.load(actionId)!
  action.lastChallenge = challengeId
  action.save()

  const challenge = new Challenge(challengeId)
  const challengeData = agreementApp.getChallenge(event.params.challengeId)
  challenge.action = buildActionId(event.address, event.params.actionId)
  challenge.challengeId = event.params.challengeId
  challenge.challenger = challengeData.value1
  challenge.endDate = challengeData.value2
  challenge.context = challengeData.value3
  challenge.settlementOffer = challengeData.value4
  challenge.state = castChallengeState(challengeData.value5)
  challenge.createdAt = event.block.timestamp

  const challengerArbitratorFeeId = challengeId + 'challenger-arbitrator-fee'
  const challengeArbitratorFeesData = agreementApp.getChallengeArbitratorFees(event.params.challengeId)
  createArbitratorFee(event.address, challengerArbitratorFeeId, challengeArbitratorFeesData.value2, challengeArbitratorFeesData.value3)
  challenge.challengerArbitratorFee = challengerArbitratorFeeId
  challenge.save()

  createAgreementStakingMovement(event.address, event.params.actionId, 'challenged', event)
}

export function handleActionSettled(event: ActionSettled): void {
  updateChallengeState(event.address, event.params.challengeId)
  createAgreementStakingMovement(event.address, event.params.actionId, 'settled', event)
}

export function handleActionDisputed(event: ActionDisputed): void {
  updateChallengeState(event.address, event.params.challengeId)

  const dispute = loadOrCreateDispute(event.address, event.params.challengeId, event)
  dispute.save()

  const challengeId = buildChallengeId(event.address, event.params.challengeId)
  const agreementApp = AgreementContract.bind(event.address)
  const challengeArbitratorFeesData = agreementApp.getChallengeArbitratorFees(event.params.challengeId)
  const submitterArbitratorFeeId = challengeId + 'submitter-arbitrator-fee'
  createArbitratorFee(event.address, submitterArbitratorFeeId, challengeArbitratorFeesData.value0, challengeArbitratorFeesData.value1)

  const challenge = Challenge.load(challengeId)!
  challenge.submitterArbitratorFee = submitterArbitratorFeeId
  challenge.save()
}

export function handleActionAccepted(event: ActionAccepted): void {
  updateChallengeState(event.address, event.params.challengeId)
  updateDisputeState(event.address, event.params.challengeId, event)
}

export function handleActionVoided(event: ActionVoided): void {
  updateChallengeState(event.address, event.params.challengeId)
  updateDisputeState(event.address, event.params.challengeId, event)
}

export function handleActionRejected(event: ActionRejected): void {
  updateChallengeState(event.address, event.params.challengeId)
  updateDisputeState(event.address, event.params.challengeId, event)
  createAgreementStakingMovement(event.address, event.params.actionId, 'rejected', event)
}

export function handleEvidenceSubmitted(event: EvidenceSubmitted): void {
  const evidenceId = buildId(event)
  const evidence = new Evidence(evidenceId)
  evidence.data = event.params.evidence
  evidence.dispute = buildDisputeId(event.address, event.params.disputeId)
  evidence.submitter = event.params.submitter
  evidence.createdAt = event.block.timestamp
  evidence.save()
}

function loadOrCreateAgreement(agreementAddress: Address): Agreement {
  let agreement = Agreement.load(agreementAddress.toHexString())
  if (agreement === null) {
    const agreementApp = AgreementContract.bind(agreementAddress)
    const stakingFactoryAddress = agreementApp.stakingFactory()
    agreement = new Agreement(agreementAddress.toHexString())
    agreement.dao = agreementApp.kernel()
    agreement.stakingFactory = stakingFactoryAddress
  }
  return agreement!
}

function loadOrCreateSigner(agreement: Address, signerAddress: Address): Signer {
  const signerId = buildSignerId(agreement, signerAddress)
  let signer = Signer.load(signerId)
  if (signer === null) {
    signer = new Signer(signerId)
    signer.agreement = agreement.toHexString()
    signer.address = signerAddress
  }
  return signer!
}

function loadOrCreateDisputable(agreement: Address, disputableAddress: Address): Disputable {
  const disputableId = buildDisputableId(agreement, disputableAddress)
  let disputable = Disputable.load(disputableId)
  if (disputable === null) {
    disputable = new Disputable(disputableId)
    disputable.agreement = agreement.toHexString()
    disputable.address = disputableAddress
  }
  return disputable!
}

function loadOrCreateDispute(agreement: Address, challengeId: BigInt, event: ethereum.Event): Dispute {
  const agreementApp = AgreementContract.bind(agreement)
  const challengeData = agreementApp.getChallenge(challengeId)
  const disputeId = buildDisputeId(agreement, challengeData.value8)

  let dispute = Dispute.load(disputeId)
  if (dispute === null) {
    dispute = new Dispute(disputeId)
    dispute.ruling = challengeData.value9
    dispute.disputeId = challengeData.value8
    dispute.challenge = buildChallengeId(agreement, challengeId)
    dispute.submitterFinishedEvidence = challengeData.value6
    dispute.challengerFinishedEvidence = challengeData.value7
    dispute.createdAt = event.block.timestamp
  }

  return dispute!
}

function updateChallengeState(agreement: Address, challengeId: BigInt): void {
  const agreementApp = AgreementContract.bind(agreement)
  const challengeData = agreementApp.getChallenge(challengeId)

  const challenge = Challenge.load(buildChallengeId(agreement, challengeId))!
  challenge.state = castChallengeState(challengeData.value5)
  challenge.save()
}

function updateDisputeState(agreement: Address, challengeId: BigInt, event: ethereum.Event): void {
  const agreementApp = AgreementContract.bind(agreement)
  const challengeData = agreementApp.getChallenge(challengeId)

  const dispute = loadOrCreateDispute(agreement, challengeId, event)
  dispute.ruling = challengeData.value9
  dispute.submitterFinishedEvidence = challengeData.value6
  dispute.challengerFinishedEvidence = challengeData.value7
  dispute.save()
}

function updateCollateralRequirement(agreement: Address, disputable: Address, collateralRequirementId: BigInt): void {
  const agreementApp = AgreementContract.bind(agreement)
  const requirementId = buildCollateralRequirementId(agreement, disputable, collateralRequirementId)

  const requirement = new CollateralRequirement(requirementId)
  const requirementData = agreementApp.getCollateralRequirement(disputable, collateralRequirementId)
  requirement.disputable = buildDisputableId(agreement, disputable)
  requirement.token = buildERC20(agreement, requirementData.value0)
  requirement.challengeDuration = requirementData.value1
  requirement.actionAmount = requirementData.value2
  requirement.challengeAmount = requirementData.value3
  requirement.save()
}

function createArbitratorFee(agreement: Address, id: string, feeToken: Address, feeAmount: BigInt): void {
  const arbitratorFee = new ArbitratorFee(id)
  arbitratorFee.amount = feeAmount
  arbitratorFee.token = buildERC20(agreement, feeToken)
  arbitratorFee.save()
}

export function buildERC20(agreement: Address, address: Address): string {
  const id = address.toHexString()
  let token = ERC20.load(id)

  if (token === null) {
    const tokenContract = ERC20Contract.bind(address)
    token = new ERC20(id)
    token.name = tokenContract.name()
    token.symbol = tokenContract.symbol()
    token.decimals = tokenContract.decimals()
    token.save()

    const agreementApp = AgreementContract.bind(agreement)
    const stakingFactoryAddress = agreementApp.stakingFactory()
    const stakingFactory = StakingFactoryContract.bind(stakingFactoryAddress)
    const stakingAddress = stakingFactory.getInstance(Address.fromString(id))
    if (stakingAddress.toHexString() != '0x0000000000000000000000000000000000000000') {
      StakingTemplate.create(stakingAddress)
    }
  }

  return token.id
}

function buildSignerId(agreement: Address, signer: Address): string {
  return agreement.toHexString() + "-signer-" + signer.toHexString()
}

function buildDisputableId(agreement: Address, disputable: Address): string {
  return agreement.toHexString() + "-disputable-" + disputable.toHexString()
}

export function buildActionId(agreement: Address, actionId: BigInt): string {
  return agreement.toHexString() + "-action-" + actionId.toString()
}

function buildChallengeId(agreement: Address, challengeId: BigInt): string {
  return agreement.toHexString() + "-challenge-" + challengeId.toString()
}

function buildDisputeId(agreement: Address, disputeId: BigInt): string {
  return agreement.toHexString() + "-dispute-" + disputeId.toString()
}

function buildVersionId(agreement: Address, versionId: BigInt): string {
  return agreement.toHexString() + "-version-" + versionId.toString()
}

function buildCollateralRequirementId(agreement: Address, disputable: Address, collateralRequirementId: BigInt): string {
  return buildDisputableId(agreement, disputable) + "-collateral-requirement-" + collateralRequirementId.toString()
}

function buildId(event: ethereum.Event): string {
  return event.transaction.hash.toHexString() + event.logIndex.toString()
}

function castChallengeState(state: i32): string {
  switch (state) {
    case 0: return 'Waiting'
    case 1: return 'Settled'
    case 2: return 'Disputed'
    case 3: return 'Rejected'
    case 4: return 'Accepted'
    case 5: return 'Voided'
    default: return 'Unknown'
  }
}
