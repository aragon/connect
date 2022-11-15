import { Address, BigInt, ByteArray, Bytes } from '@graphprotocol/graph-ts'
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
  Call as CallEntity,
} from '../generated/schema'

export function handleStartVote(event: StartVoteEvent): void {
  let voteEntityId = buildVoteEntityId(event.address, event.params.voteId)
  let vote = new VoteEntity(voteEntityId)
  let voting = VotingContract.bind(event.address)
  let voteData = voting.getVote(event.params.voteId)

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
  vote.spec = BigInt.fromI32(
    Bytes.fromHexString(vote.script.substr(0, 10)).toI32()
  )

  vote.save()

  let REWARD_SPEC_ID = 0x00000000
  let CALL_SPEC_ID = 0x00000001

  switch (vote.spec.toI32()) {
    case REWARD_SPEC_ID:
      saveRewards(vote.id, vote.script)
      break
    case CALL_SPEC_ID:
      saveCalls(vote.id, vote.script)
      break
  }
}

export function saveCalls(voteId: string, script: string): void {
  let location = 10

  while (location < script.length) {
    let contract = Address.fromHexString(script.substr(location, 40)) as Address
    let calldataLength = BigInt.fromUnsignedBytes(
      Bytes.fromHexString(script.substr(location + 40, 8)) as Bytes
    )
    let calldataLengthNumber = calldataLength.toI32()
    let calldata = Bytes.fromHexString(
      script.substr(location + 48, calldataLengthNumber * 2)
    ) as Bytes

    let call = new CallEntity(
      buildCallEntityId(
        voteId,
        Bytes.fromHexString(
          script.substr(location, calldataLengthNumber * 2) + `-${location}`
        ).toHexString()
      )
    )

    call.contract = contract
    call.calldata = calldata
    call.vote = voteId
    call.save()
    location = location + 48 + calldataLengthNumber * 2
  }
}

export function saveRewards(voteId: string, script: string): void {
  let location = 10

  while (location < script.length) {
    let token = Address.fromHexString(script.substr(location, 40)) as Address
    let to = Address.fromHexString(script.substr(location + 40, 40)) as Address
    let amount = BigInt.fromUnsignedBytes(
      Bytes.fromHexString(script.substr(location + 80, 64)) as Bytes
    )

    let reward = new RewardEntity(buildRewardId(voteId, token, to))
    reward.token = token
    reward.amount = amount
    reward.to = to
    reward.vote = voteId
    reward.save()
    location = location + 144
  }
}

export function handleCastVote(event: CastVoteEvent): void {
  updateVoteState(event.address, event.params.voteId)

  let voter = loadOrCreateVoter(event.address, event.params.voter)
  voter.save()

  let castVote = loadOrCreateCastVote(
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

  let vote = VoteEntity.load(
    buildVoteEntityId(event.address, event.params.voteId)
  )!
  vote.executed = true
  vote.executedAt = event.block.timestamp
  vote.save()
}

function buildCallEntityId(voteId: string, data: string): string {
  return voteId + '-call:' + data
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
  return voteId + '-reward-' + token.toHexString() + '-' + to.toHexString()
}

function loadOrCreateVoter(
  votingAddress: Address,
  voterAddress: Address
): VoterEntity {
  let voterId = buildVoterId(votingAddress, voterAddress)
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
  let castVoteId = buildCastEntityId(voteId, voterAddress)
  let castVote = CastEntity.load(castVoteId)
  if (castVote === null) {
    castVote = new CastEntity(castVoteId)
    castVote.vote = buildVoteEntityId(votingAddress, voteId)
  }
  return castVote!
}

export function updateVoteState(votingAddress: Address, voteId: BigInt): void {
  let votingApp = VotingContract.bind(votingAddress)
  let voteData = votingApp.getVote(voteId)

  let vote = VoteEntity.load(buildVoteEntityId(votingAddress, voteId))!
  vote.yea = voteData.value6
  vote.nay = voteData.value7

  vote.save()
}
