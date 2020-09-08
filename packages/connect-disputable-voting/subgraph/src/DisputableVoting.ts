import { BigInt, Address } from '@graphprotocol/graph-ts'
import { ERC20 as ERC20Contract } from '../generated/templates/DisputableVoting/ERC20'
import { Agreement as AgreementContract } from '../generated/templates/Agreement/Agreement'
import {
  DisputableVoting as DisputableVotingEntity,
  Setting as SettingEntity,
  Vote as VoteEntity,
  CastVote as CastVoteEntity,
  Voter as VoterEntity,
  ERC20 as ERC20Entity,
  CollateralRequirement as CollateralRequirementEntity
} from '../generated/schema'
import {
  DisputableVoting as VotingContract,
  NewSetting as NewSettingEvent,
  StartVote as StartVoteEvent,
  CastVote as CastVoteEvent,
  PauseVote as PauseVoteEvent,
  ResumeVote as ResumeVoteEvent,
  CancelVote as CancelVoteEvent,
  ExecuteVote as ExecuteVoteEvent,
  QuietEndingExtendVote as QuietEndingExtendVoteEvent,
  ChangeRepresentative as ChangeRepresentativeEvent
} from '../generated/templates/DisputableVoting/DisputableVoting'

/* eslint-disable @typescript-eslint/no-use-before-define */

export function handleNewSetting(event: NewSettingEvent): void {
  const votingApp = VotingContract.bind(event.address)
  const settingData = votingApp.getSetting(event.params.settingId)

  const voting = loadOrCreateVoting(event.address)
  const currentSettingId = buildSettingId(event.address, event.params.settingId)
  const setting = new SettingEntity(currentSettingId)
  setting.voting = event.address.toHexString()
  setting.settingId = event.params.settingId
  setting.voteTime = settingData.value0
  setting.supportRequiredPct = settingData.value1
  setting.minimumAcceptanceQuorumPct = settingData.value2
  setting.delegatedVotingPeriod = settingData.value3
  setting.quietEndingPeriod = settingData.value4
  setting.quietEndingExtension = settingData.value5
  setting.executionDelay = settingData.value6
  setting.createdAt = event.block.timestamp
  setting.save()

  voting.setting = currentSettingId
  voting.save()
}

export function handleStartVote(event: StartVoteEvent): void {
  const voteId = buildVoteId(event.address, event.params.voteId)
  const votingApp = VotingContract.bind(event.address)

  const vote = new VoteEntity(voteId)
  const voteData = votingApp.getVote(event.params.voteId)
  vote.voting = event.address.toHexString()
  vote.voteId = event.params.voteId
  vote.creator = event.params.creator
  vote.context = event.params.context.toString()
  vote.yeas = voteData.value0
  vote.nays = voteData.value1
  vote.totalPower = voteData.value2
  vote.startDate = voteData.value3
  vote.snapshotBlock = voteData.value4
  vote.status = castVoteStatus(voteData.value5)
  vote.setting = buildSettingId(event.address, voteData.value6)
  vote.actionId = voteData.value7
  vote.challengeId = BigInt.fromI32(0)
  vote.challenger = Address.fromString('0x0000000000000000000000000000000000000000')
  vote.challengeEndDate = BigInt.fromI32(0)
  vote.pausedAt = voteData.value8
  vote.pauseDuration = voteData.value9
  vote.quietEndingExtensionDuration = voteData.value10
  vote.quietEndingSnapshotSupport = castVoterState(voteData.value11)
  vote.script = event.params.executionScript
  vote.settledAt = BigInt.fromI32(0)
  vote.disputedAt = BigInt.fromI32(0)
  vote.executedAt = BigInt.fromI32(0)
  vote.isAccepted = isAccepted(vote.yeas, vote.nays, vote.totalPower, vote.setting, votingApp.PCT_BASE())
  vote.save()

  const agreementApp = AgreementContract.bind(votingApp.getAgreement())
  const actionData = agreementApp.getAction(vote.actionId)
  const collateralRequirementData = agreementApp.getCollateralRequirement(event.address, actionData.value2)
  const collateralRequirement = new CollateralRequirementEntity(voteId)
  collateralRequirement.vote = voteId
  collateralRequirement.token = buildERC20(collateralRequirementData.value0)
  collateralRequirement.challengeDuration = collateralRequirementData.value1
  collateralRequirement.actionAmount = collateralRequirementData.value2
  collateralRequirement.challengeAmount = collateralRequirementData.value3
  collateralRequirement.save()
}

export function handleCastVote(event: CastVoteEvent): void {
  updateVoteState(event.address, event.params.voteId)

  const voter = loadOrCreateVoter(event.address, event.params.voter)
  voter.save()

  const votingApp = VotingContract.bind(event.address)
  const vote = VoteEntity.load(buildVoteId(event.address, event.params.voteId))!
  const miniMeToken = ERC20Contract.bind(votingApp.token())
  const stake = miniMeToken.balanceOfAt(event.params.voter, vote.snapshotBlock)

  const castVote = loadOrCreateCastVote(event.address, event.params.voteId, event.params.voter)
  castVote.voter = voter.id
  castVote.stake = stake
  castVote.supports = event.params.supports
  castVote.createdAt = event.block.timestamp
  castVote.caster = event.params.caster
  castVote.save()
}

export function handlePauseVote(event: PauseVoteEvent): void {
  updateVoteState(event.address, event.params.voteId)

  const votingApp = VotingContract.bind(event.address)
  const agreementApp = AgreementContract.bind(votingApp.getAgreement())
  const challengeData = agreementApp.getChallenge(event.params.challengeId)
  const vote = VoteEntity.load(buildVoteId(event.address, event.params.voteId))!
  vote.challenger = challengeData.value1
  vote.challengeId = event.params.challengeId
  vote.challengeEndDate = challengeData.value2
  vote.save()
}

export function handleResumeVote(event: ResumeVoteEvent): void {
  updateVoteState(event.address, event.params.voteId)
}

export function handleCancelVote(event: CancelVoteEvent): void {
  updateVoteState(event.address, event.params.voteId)
}

export function handleExecuteVote(event: ExecuteVoteEvent): void {
  updateVoteState(event.address, event.params.voteId)

  const vote = VoteEntity.load(buildVoteId(event.address, event.params.voteId))!
  vote.executedAt = event.block.timestamp
  vote.save()
}

export function handleQuietEndingExtendVote(event: QuietEndingExtendVoteEvent): void {
  updateVoteState(event.address, event.params.voteId)
}

export function handleChangeRepresentative(event: ChangeRepresentativeEvent): void {
  const voter = loadOrCreateVoter(event.address, event.params.voter)
  voter.representative = event.params.representative
  voter.save()
}

function isAccepted(yeas: BigInt, nays: BigInt, totalPower: BigInt, settingId: string, pctBase: BigInt): boolean {
  const setting = SettingEntity.load(settingId)!
  return hasReachedValuePct(yeas, yeas.plus(nays), setting.supportRequiredPct, pctBase) &&
         hasReachedValuePct(yeas, totalPower, setting.minimumAcceptanceQuorumPct, pctBase)
}

function hasReachedValuePct(value: BigInt, total: BigInt, pct: BigInt, pctBase: BigInt): boolean {
  return total.notEqual(BigInt.fromI32(0)) && (value.times(pctBase).div(total)).gt(pct)
}

function loadOrCreateVoting(votingAddress: Address): DisputableVotingEntity {
  let voting = DisputableVotingEntity.load(votingAddress.toHexString())
  if (voting === null) {
    const votingApp = VotingContract.bind(votingAddress)
    voting = new DisputableVotingEntity(votingAddress.toHexString())
    voting.dao = votingApp.kernel()
    voting.token = buildERC20(votingApp.token())
  }
  return voting!
}

function loadOrCreateCastVote(votingAddress: Address, voteId: BigInt, voterAddress: Address): CastVoteEntity {
  const castVoteId = buildCastVoteId(votingAddress, voteId, voterAddress)
  let castVote = CastVoteEntity.load(castVoteId)
  if (castVote === null) {
    castVote = new CastVoteEntity(castVoteId)
    castVote.vote = buildVoteId(votingAddress, voteId)
  }
  return castVote!
}

function loadOrCreateVoter(votingAddress: Address, voterAddress: Address): VoterEntity {
  const voterId = buildVoterId(votingAddress, voterAddress)
  let voter = VoterEntity.load(voterId)
  if (voter === null) {
    voter = new VoterEntity(voterId)
    voter.voting = votingAddress.toHexString()
    voter.address = voterAddress
  }
  return voter!
}

function updateVoteState(votingAddress: Address, voteId: BigInt): void {
  const votingApp = VotingContract.bind(votingAddress)
  const voteData = votingApp.getVote(voteId)

  const vote = VoteEntity.load(buildVoteId(votingAddress, voteId))!
  vote.yeas = voteData.value0
  vote.nays = voteData.value1
  vote.status = castVoteStatus(voteData.value5)
  vote.pausedAt = voteData.value8
  vote.pauseDuration = voteData.value9
  vote.quietEndingExtensionDuration = voteData.value10
  vote.quietEndingSnapshotSupport = castVoterState(voteData.value11)
  vote.isAccepted = isAccepted(vote.yeas, vote.nays, vote.totalPower, vote.setting, votingApp.PCT_BASE())
  vote.save()
}

export function buildERC20(address: Address): string {
  const id = address.toHexString()
  let token = ERC20Entity.load(id)

  if (token === null) {
    const tokenContract = ERC20Contract.bind(address)
    token = new ERC20Entity(id)
    token.name = tokenContract.name()
    token.symbol = tokenContract.symbol()
    token.decimals = tokenContract.decimals()
    token.save()
  }

  return token.id
}

export function buildVoteId(voting: Address, voteId: BigInt): string {
  return voting.toHexString() + "-vote-" + voteId.toString()
}

function buildVoterId(voting: Address, voter: Address): string {
  return voting.toHexString() + "-voter-" + voter.toHexString()
}

function buildCastVoteId(voting: Address, voteId: BigInt, voter: Address): string {
  return buildVoteId(voting, voteId) + "-cast-" + voter.toHexString()
}

function buildSettingId(voting: Address, settingId: BigInt): string {
  return voting.toHexString() + "-setting-" + settingId.toString()
}

function castVoterState(state: i32): string {
  switch (state) {
    case 0: return 'Absent'
    case 1: return 'Yea'
    case 2: return 'Nay'
    default: return 'Unknown'
  }
}

function castVoteStatus(state: i32): string {
  switch (state) {
    case 0: return 'Scheduled'
    case 1: return 'Challenged'
    case 2: return 'Cancelled'
    case 3: return 'Executed'
    default: return 'Unknown'
  }
}
