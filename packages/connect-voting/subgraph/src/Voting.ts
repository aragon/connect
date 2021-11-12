import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import {
  StartVote as StartVoteEvent,
  CastVote as CastVoteEvent,
  ExecuteVote as ExecuteVoteEvent,
  Voting as VotingContract,
} from '../generated/templates/Voting/Voting'
import {
  Vote as VoteEntity,
  Cast as CastEntity,
  Voter as VoterEntity,
  Reward as RewardEntity,
  EvmScript as EvmScriptEntity
} from '../generated/schema'

/* eslint-disable @typescript-eslint/no-use-before-define */

const REWARDS_SCRIPT_ID = BigInt.fromI32(0x00000000)
const EVM_SCRIPT_ID = BigInt.fromI32(0x00000001)

export function handleStartVote(event: StartVoteEvent): void {
  const voteEntityId = buildVoteEntityId(event.address, event.params.voteId)
  const vote = new VoteEntity(voteEntityId)
  const voting = VotingContract.bind(event.address)
  const voteData = voting.getVote(event.params.voteId)

  vote.appAddress = event.address
  vote.creator = event.params.creator
  vote.originalCreator = event.transaction.from
  vote.metadata = event.params.metadata
  vote.voteNum = event.params.voteId
  vote.startDate = voteData.value2
  vote.snapshotBlock = voteData.value3
  vote.supportRequiredPct = voteData.value4
  vote.minAcceptQuorum = voteData.value5
  vote.yea = voteData.value6
  vote.nay = voteData.value7
  vote.votingPower = voteData.value8
  vote.script = voteData.value9.toHexString()
  vote.orgAddress = voting.kernel()
  vote.executedAt = BigInt.fromI32(0)
  vote.executed = false
  vote.spec = new BigInt(voteData.value9.slice(0, 4))

  vote.save()

  switch(vote.spec) {
    case REWARDS_SCRIPT_ID:
      saveRewards(vote.id, vote.script)
      break;
    case EVM_SCRIPT_ID:
      saveScripts(vote.id, vote.script)
      break;
  }
}

export function saveScripts(voteId: string, script: string): void {
  const scriptBytes = Bytes.fromHexString(script)

  let location = 4

  while (location < scriptBytes.length) {
    const contract = new Address(scriptBytes.slice(location, location + 20))
    const calldataLength = new BigInt(scriptBytes.slice(location + 20, location + 24))
    const calldata = new Bytes(scriptBytes.slice(location + 24, location + 24 + calldataLength.toI32()))

    let evmScript = new EvmScriptEntity(buildEvmScriptEntityId(voteId, new Bytes(scriptBytes.slice(location, location + 24 + calldataLength.toI32())).toHexString()))
    evmScript.contract = contract
    evmScript.calldataLength = calldataLength
    evmScript.calldata = calldata
    location =  location + 24 + calldataLength.toI32()
  }
}

export function saveRewards(voteId: string, script: string): void {  
  const scriptBytes = Bytes.fromHexString(script)
 
  let location = 4

  while (location < script.length) {
    const token = new Address(scriptBytes.slice(location, location + 20))
    const to = new Address(scriptBytes.slice(location + 20, location + 40))
    const amount = new BigInt(scriptBytes.slice(location + 40, location + 72))

    let reward = new RewardEntity(buildRewardId(voteId, token, to))
    reward.amount = amount
    reward.vote = voteId
    reward.save()
    location = location + 72
  }
}

export function handleCastVote(event: CastVoteEvent): void {
  updateVoteState(event.address, event.params.voteId)

  const voter = loadOrCreateVoter(event.address, event.params.voter)
  voter.save()

  const castVote = loadOrCreateCastVote(
    event.address,
    event.params.voteId,
    event.params.voter
  )

  castVote.voter = voter.id
  castVote.stake = event.params.stake
  castVote.supports = event.params.supports
  castVote.createdAt = event.block.timestamp

  castVote.save()
}

export function handleExecuteVote(event: ExecuteVoteEvent): void {
  updateVoteState(event.address, event.params.voteId)

  const vote = VoteEntity.load(
    buildVoteEntityId(event.address, event.params.voteId)
  )!
  vote.executed = true
  vote.executedAt = event.block.timestamp
  vote.save()
}

function buildEvmScriptEntityId(voteId: string, data: string): string {
  return (
    voteId + '-evmScript:' + data
  )
}

function buildVoteEntityId(appAddress: Address, voteNum: BigInt): string {
  return (
    'appAddress:' + appAddress.toHexString() + '-vote:' + voteNum.toHexString()
  )
}

function buildVoterId(voting: Address, voter: Address): string {
  return voting.toHexString() + '-voter-' + voter.toHexString()
}

function buildCastEntityId(voteId: BigInt, voter: Address): string {
  return voteId.toHexString() + '-voter:' + voter.toHexString()
}

function buildRewardId(voteId: string, token: Address, to: Address): string {
  return voteId + '-reward-' + token.toHexString()  + '-' + to.toHexString()
}

function loadOrCreateVoter(
  votingAddress: Address,
  voterAddress: Address
): VoterEntity {
  const voterId = buildVoterId(votingAddress, voterAddress)
  let voter = VoterEntity.load(voterId)
  if (voter === null) {
    voter = new VoterEntity(voterId)
    voter.address = voterAddress
  }
  return voter!
}

function loadOrCreateCastVote(
  votingAddress: Address,
  voteId: BigInt,
  voterAddress: Address
): CastEntity {
  const castVoteId = buildCastEntityId(voteId, voterAddress)
  let castVote = CastEntity.load(castVoteId)
  if (castVote === null) {
    castVote = new CastEntity(castVoteId)
    castVote.vote = buildVoteEntityId(votingAddress, voteId)
  }
  return castVote!
}

export function updateVoteState(votingAddress: Address, voteId: BigInt): void {
  const votingApp = VotingContract.bind(votingAddress)
  const voteData = votingApp.getVote(voteId)

  const vote = VoteEntity.load(buildVoteEntityId(votingAddress, voteId))!
  vote.yea = voteData.value6
  vote.nay = voteData.value7

  vote.save()
}
