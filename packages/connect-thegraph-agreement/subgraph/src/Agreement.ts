import { ERC20 } from '../generated/schema'
import { ERC20 as ERC20Contract } from '../generated/templates/Agreement/ERC20'
import { ethereum, BigInt, Address } from '@graphprotocol/graph-ts'
import { Agreement, Action, Signature, Version, Disputable, Challenge, Dispute, Evidence, Signer, CollateralRequirement } from '../generated/schema'
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

export function handleSettingChanged(event: SettingChanged): void {
  let agreementApp = AgreementContract.bind(event.address)
  let settingData = agreementApp.getSetting(event.params.settingId)

  let agreement = loadOrCreateAgreement(event.address)
  let currentVersionId = buildVersionId(event.address, event.params.settingId)
  let version = new Version(currentVersionId)
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
  let signer = loadOrCreateSigner(event.address, event.params.signer)
  signer.save()

  let signature = new Signature(event.transaction.hash.toHexString())
  signature.signer = buildSignerId(event.address, event.params.signer)
  signature.version = buildVersionId(event.address, event.params.settingId)
  signature.createdAt = event.block.timestamp
  signature.save()
}

export function handleDisputableAppActivated(event: DisputableAppActivated): void {
  let agreementApp = AgreementContract.bind(event.address)
  let disputableData = agreementApp.getDisputableInfo(event.params.disputable)
  let disputable = loadOrCreateDisputable(event.address, event.params.disputable)
  disputable.activated = true
  disputable.currentCollateralRequirement = buildCollateralRequirementId(event.address, event.params.disputable, disputableData.value1)
  disputable.save()

  updateCollateralRequirement(event.address, event.params.disputable, disputableData.value1)
}

export function handleDisputableAppDeactivated(event: DisputableAppDeactivated): void {
  let disputable = loadOrCreateDisputable(event.address, event.params.disputable)
  disputable.activated = false
  disputable.save()
}

export function handleCollateralRequirementChanged(event: CollateralRequirementChanged): void {
  updateCollateralRequirement(event.address, event.params.disputable, event.params.collateralRequirementId)
}

export function handleActionSubmitted(event: ActionSubmitted): void {
  let actionId = buildActionId(event.address, event.params.actionId)
  let agreementApp = AgreementContract.bind(event.address)

  let action = new Action(actionId)
  let actionData = agreementApp.getAction(event.params.actionId)
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
  let agreementApp = AgreementContract.bind(event.address)
  let actionData = agreementApp.getAction(event.params.actionId)

  let action = Action.load(buildActionId(event.address, event.params.actionId))!
  action.closed = actionData.value5
  action.save()
}

export function handleActionChallenged(event: ActionChallenged): void {
  let actionId = buildActionId(event.address, event.params.actionId)
  let challengeId = buildChallengeId(event.address, event.params.challengeId)
  let agreementApp = AgreementContract.bind(event.address)

  let action = Action.load(actionId)!
  action.currentChallenge = challengeId
  action.save()

  let challenge = new Challenge(challengeId)
  let challengeData = agreementApp.getChallenge(event.params.challengeId)
  challenge.action = buildActionId(event.address, event.params.actionId)
  challenge.challengeId = event.params.challengeId
  challenge.challenger = challengeData.value1
  challenge.endDate = challengeData.value2
  challenge.context = challengeData.value3
  challenge.settlementOffer = challengeData.value4
  challenge.arbitratorFeeAmount = challengeData.value5
  challenge.arbitratorFeeToken = buildERC20(challengeData.value6)
  challenge.state = castChallengeState(challengeData.value7)
  challenge.createdAt = event.block.timestamp
  challenge.save()
}

export function handleActionSettled(event: ActionSettled): void {
  updateChallengeState(event.address, event.params.challengeId)
}

export function handleActionDisputed(event: ActionDisputed): void {
  updateChallengeState(event.address, event.params.challengeId)

  let agreementApp = AgreementContract.bind(event.address)
  let challengeData = agreementApp.getChallenge(event.params.challengeId)

  let dispute = new Dispute(buildDisputeId(event.address, challengeData.value10))
  dispute.ruling = challengeData.value11
  dispute.disputeId = challengeData.value10
  dispute.challenge = buildChallengeId(event.address, event.params.challengeId)
  dispute.submitterFinishedEvidence = challengeData.value8
  dispute.challengerFinishedEvidence = challengeData.value9
  dispute.createdAt = event.block.timestamp
  dispute.save()
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
  let evidenceId = buildId(event)
  let evidence = new Evidence(evidenceId)
  evidence.data = event.params.evidence
  evidence.dispute = buildDisputeId(event.address, event.params.disputeId)
  evidence.submitter = event.params.submitter
  evidence.createdAt = event.block.timestamp
  evidence.save()
}

function loadOrCreateAgreement(agreementAddress: Address): Agreement {
  let agreement = Agreement.load(agreementAddress.toHexString())
  if (agreement === null) {
    let agreementApp = AgreementContract.bind(agreementAddress)
    agreement = new Agreement(agreementAddress.toHexString())
    agreement.dao = agreementApp.kernel()
    agreement.stakingFactory = agreementApp.stakingFactory()
  }
  return agreement!
}

function loadOrCreateSigner(agreement: Address, signerAddress: Address): Signer {
  let signerId = buildSignerId(agreement, signerAddress)
  let signer = Signer.load(signerId)
  if (signer === null) {
    signer = new Signer(signerId)
    signer.agreement = agreement.toHexString()
    signer.address = signerAddress
  }
  return signer!
}

function loadOrCreateDisputable(agreement: Address, disputableAddress: Address): Disputable {
  let disputableId = buildDisputableId(agreement, disputableAddress)
  let disputable = Disputable.load(disputableId)
  if (disputable === null) {
    disputable = new Disputable(disputableId)
    disputable.agreement = agreement.toHexString()
    disputable.address = disputableAddress
  }
  return disputable!
}

function updateChallengeState(agreement: Address, challengeId: BigInt): void {
  let agreementApp = AgreementContract.bind(agreement)
  let challengeData = agreementApp.getChallenge(challengeId)

  let challenge = Challenge.load(buildChallengeId(agreement, challengeId))!
  challenge.state = castChallengeState(challengeData.value7)
  challenge.save()
}

function updateDisputeState(agreement: Address, challengeId: BigInt): void {
  let agreementApp = AgreementContract.bind(agreement)
  let challengeData = agreementApp.getChallenge(challengeId)

  let dispute = Dispute.load(buildDisputeId(agreement, challengeId))!
  dispute.ruling = challengeData.value11
  dispute.submitterFinishedEvidence = challengeData.value8
  dispute.challengerFinishedEvidence = challengeData.value9
  dispute.save()
}

function updateCollateralRequirement(agreement: Address, disputable: Address, collateralRequirementId: BigInt): void {
  let agreementApp = AgreementContract.bind(agreement)
  let requirementId = buildCollateralRequirementId(agreement, disputable, collateralRequirementId)

  let requirement = new CollateralRequirement(requirementId)
  let requirementData = agreementApp.getCollateralRequirement(disputable, collateralRequirementId)
  requirement.disputable = buildDisputableId(agreement, disputable)
  requirement.token = buildERC20(requirementData.value0)
  requirement.actionAmount = requirementData.value1
  requirement.challengeAmount = requirementData.value2
  requirement.challengeDuration = requirementData.value3
  requirement.save()
}

function buildERC20(address: Address): string {
  let id = address.toHexString()
  let token = ERC20.load(id)

  if (token === null) {
    let tokenContract = ERC20Contract.bind(address)
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
  return agreement.toHexString() + "-collateral-requirement-" + collateralRequirementId.toString()
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
