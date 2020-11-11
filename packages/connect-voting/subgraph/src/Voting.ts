import { Address, BigInt } from '@graphprotocol/graph-ts'
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
} from '../generated/schema'

/* eslint-disable @typescript-eslint/no-use-before-define */

export function handleStartVote(event: StartVoteEvent): void {
  const voteEntityId = buildVoteEntityId(event.address, event.params.voteId)
  const vote = new VoteEntity(voteEntityId)
  const voting = VotingContract.bind(event.address)
  const voteData = voting.getVote(event.params.voteId)

  vote.appAddress = event.address
  vote.creator = event.params.creator
  vote.metadata = event.params.metadata
  vote.voteNum = event.params.voteId
  vote.startDate = voteData.value2
  vote.snapshotBlock = voteData.value3
  vote.supportRequiredPct = voteData.value4
  vote.minAcceptQuorum = voteData.value5
  vote.yea = voteData.value6
  vote.nay = voteData.value7
  vote.votingPower = voteData.value8
  vote.script = voteData.value9.toHex()
  vote.orgAddress = voting.kernel()
  vote.executedAt = BigInt.fromI32(0)
  vote.executed = false

  vote.save()
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

function buildVoteEntityId(appAddress: Address, voteNum: BigInt): string {
  return (
    'appAddress:' +
    appAddress.toHexString() +
    '-voteId:' +
    voteNum.toHexString()
  )
}

function buildVoterId(voting: Address, voter: Address): string {
  return voting.toHexString() + '-voter-' + voter.toHexString()
}

function buildCastEntityId(voteId: BigInt, voter: Address): string {
  return voteId.toHexString() + '-voter:' + voter.toHexString()
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
