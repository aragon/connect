import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts'
import {
  StartVote as StartVoteEvent,
  CastVote as CastVoteEvent,
  ExecuteVote as ExecuteVoteEvent,
  Voting as VotingContract
} from '../generated/templates/Voting/Voting'
import {
  Vote as VoteEntity,
  Cast as CastEntity
} from '../generated/schema'

/* --------------------- REDUCERS --------------------- */

export function handleStartVote(event: StartVoteEvent): void {
  let vote = _getVoteEntity(event.address, event.params.voteId)

  _populateVoteDataFromEvent(vote, event)
  _populateVoteDataFromContract(vote, event.address, vote.voteNum)

  vote.save()
}

export function handleCastVote(event: CastVoteEvent): void {
  let vote = _getVoteEntity(event.address, event.params.voteId)

  let numCasts = vote.casts.length

  let castId = _getCastEntityId(vote, numCasts)
  let cast = new CastEntity(castId)

  _populateCastDataFromEvent(cast, event, vote.voteNum)

  let casts = vote.casts
  casts.push(castId)
  vote.casts = casts

  vote.save()
  cast.save()
}

export function handleExecuteVote(event: ExecuteVoteEvent): void {
  let vote = _getVoteEntity(event.address, event.params.voteId)

  vote.executed = true

  vote.save()
}

/* --------------------- HELPERS --------------------- */

function _getVoteEntity(appAddress: Address, voteNum: BigInt): VoteEntity {
  let voteEntityId = _getVoteEntityId(appAddress, voteNum)

  let vote = VoteEntity.load(voteEntityId)
  if (!vote) {
    vote = new VoteEntity(voteEntityId)

    vote.voteNum = voteNum
    vote.executed = false
    vote.casts = []
  }

  return vote!
}

function _getCastEntityId(vote: VoteEntity, numCast: number): string {
  return vote.id + '-castNum:' + numCast.toString()
}

function _getVoteEntityId(appAddress: Address, voteNum: BigInt): string {
  return 'appAddress:' + appAddress.toHexString() + '-voteId:' + voteNum.toHexString()
}

function _populateVoteDataFromContract(vote: VoteEntity, appAddress: Address, voteNum: BigInt): void {
  let voting = VotingContract.bind(appAddress)

  let voteData = voting.getVote(voteNum)

  vote.open = voteData.value0
  vote.executed = voteData.value1
  vote.startDate = voteData.value2
  vote.snapshotBlock = voteData.value3
  vote.supportRequiredPct = voteData.value4
  vote.minAcceptQuorum = voteData.value5
  vote.yea = voteData.value6
  vote.nay = voteData.value7
  vote.votingPower = voteData.value8
  vote.script = voteData.value9
  vote.orgAddress = voting.kernel()
  vote.appAddress = appAddress
}

function _populateVoteDataFromEvent(vote: VoteEntity, event: StartVoteEvent): void {
  vote.creator = event.params.creator
  vote.metadata = event.params.metadata
}

function _populateCastDataFromEvent(cast: CastEntity, event: CastVoteEvent, voteNum: BigInt): void {
  cast.voteNum = voteNum
  cast.voter = event.params.voter
  cast.supports = event.params.supports
  cast.voterStake = event.params.stake
}
