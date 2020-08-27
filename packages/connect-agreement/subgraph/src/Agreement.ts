import { ERC20 } from '../generated/schema'
import { ERC20 as ERC20Contract } from '../generated/templates/Agreement/ERC20'
import { ethereum, BigInt, Address } from '@graphprotocol/graph-ts'
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
}

export function handleActionClosed(event: ActionClosed): void {
  const agreementApp = AgreementContract.bind(event.address)

  const action = Action.load(buildActionId(event.address, event.params.actionId))!
  action.closed = true
  action.save()
}

export function handleActionChallenged(event: ActionChallenged): void {
  const actionId = buildActionId(event.address, event.params.actionId)
  const challengeId = buildChallengeId(event.address, event.params.challengeId)
  const agreementApp = AgreementContract.bind(event.address)

  const action = Action.load(actionId)!
  action.currentChallenge = challengeId
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
  createArbitratorFee(challengerArbitratorFeeId, challengeArbitratorFeesData.value2, challengeArbitratorFeesData.value3)
  challenge.challengerArbitratorFee = challengerArbitratorFeeId

  challenge.save()
}

export function handleActionSettled(event: ActionSettled): void {
  updateChallengeState(event.address, event.params.challengeId)
}

export function handleActionDisputed(event: ActionDisputed): void {
  updateChallengeState(event.address, event.params.challengeId)

  const challengeId = buildChallengeId(event.address, event.params.challengeId)
  const agreementApp = AgreementContract.bind(event.address)
  const challengeData = agreementApp.getChallenge(event.params.challengeId)
  const challengeArbitratorFeesData = agreementApp.getChallengeArbitratorFees(event.params.challengeId)

  const dispute = new Dispute(buildDisputeId(event.address, challengeData.value8))
  dispute.ruling = challengeData.value9
  dispute.disputeId = challengeData.value8
  dispute.challenge = challengeId
  dispute.submitterFinishedEvidence = challengeData.value6
  dispute.challengerFinishedEvidence = challengeData.value7
  dispute.createdAt = event.block.timestamp
  dispute.save()

  const challenge = Challenge.load(challengeId)!
  const submitterArbitratorFeeId = challengeId + 'submitter-arbitrator-fee'
  createArbitratorFee(submitterArbitratorFeeId, challengeArbitratorFeesData.value0, challengeArbitratorFeesData.value1)
  challenge.submitterArbitratorFee = submitterArbitratorFeeId
  challenge.save()
}

export function handleActionAccepted(event: ActionAccepted): void {
  updateChallengeState(event.address, event.params.challengeId)
  updateDisputeState(event.address, event.params.challengeId)
}

export function handleActionVoided(event: ActionVoided): void {
  updateChallengeState(event.address, event.params.challengeId)
  updateDisputeState(event.address, event.params.challengeId)
}

export function handleActionRejected(event: ActionRejected): void {
  updateChallengeState(event.address, event.params.challengeId)
  updateDisputeState(event.address, event.params.challengeId)
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
    agreement = new Agreement(agreementAddress.toHexString())
    agreement.dao = agreementApp.kernel()
    agreement.stakingFactory = agreementApp.stakingFactory()
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

function updateChallengeState(agreement: Address, challengeId: BigInt): void {
  const agreementApp = AgreementContract.bind(agreement)
  const challengeData = agreementApp.getChallenge(challengeId)

  const challenge = Challenge.load(buildChallengeId(agreement, challengeId))!
  challenge.state = castChallengeState(challengeData.value5)
  challenge.save()
}

function updateDisputeState(agreement: Address, challengeId: BigInt): void {
  const agreementApp = AgreementContract.bind(agreement)
  const challengeData = agreementApp.getChallenge(challengeId)

  const dispute = Dispute.load(buildDisputeId(agreement, challengeId))!
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
  requirement.token = buildERC20(requirementData.value0)
  requirement.challengeDuration = requirementData.value1
  requirement.actionAmount = requirementData.value2
  requirement.challengeAmount = requirementData.value3
  requirement.save()
}

function createArbitratorFee(id: string, feeToken: Address, feeAmount: BigInt): void {
  const arbitratorFee = new ArbitratorFee(id)
  arbitratorFee.amount = feeAmount
  arbitratorFee.token = buildERC20(feeToken)
  arbitratorFee.save()
}

function buildERC20(address: Address): string {
  const id = address.toHexString()
  let token = ERC20.load(id)

  if (token === null) {
    const tokenContract = ERC20Contract.bind(address)
    token = new ERC20(id)
    token.name = tokenContract.name()
    token.symbol = tokenContract.symbol()
    token.decimals = tokenContract.decimals()
    token.save()
  }

  return token.id
}

function buildSignerId(agreement: Address, signer: Address): string {
  return agreement.toHexString() + "-signer-" + signer.toHexString()
}

function buildDisputableId(agreement: Address, disputable: Address): string {
  return agreement.toHexString() + "-disputable-" + disputable.toHexString()
}

function buildActionId(agreement: Address, actionId: BigInt): string {
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

export function buildId(event: ethereum.Event): string {
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
