import { ethereum, Bytes, BigInt, Address } from '@graphprotocol/graph-ts'

import { buildActionId } from './Agreement'
import { Staking, StakingMovement } from '../generated/schema'
import { Agreement as AgreementContract } from '../generated/templates/Agreement/Agreement'
import {
  Staked as StakedEvent,
  Unstaked as UnstakedEvent,
  StakeTransferred as StakeTransferredEvent,
  Staking as StakingContract
} from '../generated/templates/Staking/Staking'

/* eslint-disable @typescript-eslint/no-use-before-define */

const AGREEMENT_ADDRESS = Address.fromString('0x8a9893db28fe41bcafc07c9c4da73a6a85d3732c')

export function handleStaked(event: StakedEvent): void {
  const stakingApp = StakingContract.bind(event.address)
  const token = stakingApp.token()
  const staking = updateStaking(event.address, token, event.params.user)

  const id = buildStakingMovementId(token, event.params.user, buildId(event))
  const movement = new StakingMovement(id)
  movement.amount = event.params.amount
  movement.staking = staking.id
  movement.actionState = 'NA'
  movement.collateralState = 'Available'
  movement.createdAt = event.block.timestamp
  movement.agreement = AGREEMENT_ADDRESS.toHexString() // Check what to do here
  movement.save()
}

export function handleUnstaked(event: UnstakedEvent): void {
  const stakingApp = StakingContract.bind(event.address)
  const token = stakingApp.token()
  const staking = updateStaking(event.address, token, event.params.user)

  const id = buildStakingMovementId(token, event.params.user, buildId(event))
  const movement = new StakingMovement(id)
  movement.amount = event.params.amount
  movement.staking = staking.id
  movement.actionState = 'NA'
  movement.collateralState = 'Withdrawn'
  movement.createdAt = event.block.timestamp
  movement.agreement = AGREEMENT_ADDRESS.toHexString() // Check what to do here
  movement.save()
}

export function handleStakeTransferred(event: StakeTransferredEvent): void {
  const stakingApp = StakingContract.bind(event.address)
  const token = stakingApp.token()

  const fromStaking = updateStaking(event.address, token, event.params.from)
  const withdrawId = buildStakingMovementId(token, event.params.from, buildId(event))
  const withdraw = new StakingMovement(withdrawId)
  withdraw.amount = event.params.amount
  withdraw.staking = fromStaking.id
  withdraw.actionState = 'NA'
  withdraw.collateralState = 'Withdrawn'
  withdraw.createdAt = event.block.timestamp
  withdraw.agreement = Address.fromString('0x8a9893db28fe41bcafc07c9c4da73a6a85d3732c').toHexString() // Check what to do here
  withdraw.save()

  const toStaking = updateStaking(event.address, token, event.params.to)
  const despositId = buildStakingMovementId(token, event.params.to, buildId(event))
  const deposit = new StakingMovement(despositId)
  deposit.amount = event.params.amount
  deposit.staking = toStaking.id
  deposit.actionState = 'NA'
  deposit.collateralState = 'Available'
  deposit.createdAt = event.block.timestamp
  deposit.agreement = Address.fromString('0x8a9893db28fe41bcafc07c9c4da73a6a85d3732c').toHexString() // Check what to do here
  deposit.save()
}

export function createAgreementStakingMovement(agreement: Address, actionId: BigInt, type: string, event: ethereum.Event): void {
  const agreementApp = AgreementContract.bind(agreement)
  const actionData = agreementApp.getAction(actionId)
  const collateralData = agreementApp.getCollateralRequirement(actionData.value0, actionData.value2)

  const user = actionData.value4
  const token = collateralData.value0
  const collateralAmount = collateralData.value2

  if (collateralAmount.equals(BigInt.fromI32(0))) {
    return
  }

  const staking = loadOrCreateStaking(token, user)

  const id = buildStakingMovementId(token, user, buildId(event))
  const movement = new StakingMovement(id)
  movement.staking = staking.id
  movement.agreement = agreement.toHexString()
  movement.action = buildActionId(agreement, actionId)
  movement.createdAt = event.block.timestamp

  if (type == 'new') {
    movement.amount = collateralAmount
    movement.actionState = 'Scheduled'
    movement.collateralState = 'Locked'
    staking.available = staking.available.minus(collateralAmount)
    staking.locked = staking.locked.plus(collateralAmount)
  } else if (type == 'challenged') {
    movement.amount = collateralAmount
    movement.actionState = 'Challenged'
    movement.collateralState = 'Challenged'
    staking.challenged = staking.challenged.plus(collateralAmount)
  } else if (type == 'settled') {
    const challengeData = agreementApp.getChallenge(actionData.value7)
    const settlementOffer = challengeData.value4
    const unlockedBalance = collateralAmount.minus(settlementOffer)
    movement.amount = settlementOffer
    movement.actionState = 'Settled'
    movement.collateralState = 'Slashed'
    staking.available = staking.available.plus(unlockedBalance)
    staking.locked = staking.locked.minus(collateralAmount)
    staking.challenged = staking.challenged.minus(collateralAmount)
  } else if (type == 'rejected') {
    movement.amount = collateralAmount
    movement.actionState = 'Cancelled'
    movement.collateralState = 'Slashed'
    staking.locked = staking.locked.minus(collateralAmount)
    staking.challenged = staking.challenged.minus(collateralAmount)
  } else { // closed
    movement.amount = collateralAmount
    movement.actionState = 'Completed'
    movement.collateralState = 'Available'
    staking.available = staking.available.plus(collateralAmount)
    staking.locked = staking.locked.minus(collateralAmount)
    staking.challenged = staking.challenged.minus(collateralAmount)
  }

  staking.save()
  movement.save()
}

function updateStaking(stakingAddress: Address, token: Address, user: Address): Staking {
  const stakingApp = StakingContract.bind(stakingAddress)
  const balance = stakingApp.getBalancesOf(user)

  const staking = loadOrCreateStaking(token, user)
  staking.total = balance.value0
  staking.locked = balance.value1
  staking.available = staking.total.minus(staking.locked)
  staking.save()

  return staking
}

function loadOrCreateStaking(token: Address, user: Address): Staking {
  const id = buildStakingId(token, user)
  let staking = Staking.load(id)

  if (staking === null) {
    staking = new Staking(id)
    staking.user = user
    staking.token = token.toHexString()
    staking.total = BigInt.fromI32(0)
    staking.locked = BigInt.fromI32(0)
    staking.available = BigInt.fromI32(0)
    staking.challenged = BigInt.fromI32(0)
  }

  return staking!
}

function buildStakingId(token: Address, user: Address): string {
  return token.toHexString() + "-staking-" + user.toHexString()
}

function buildStakingMovementId(token: Address, user: Address, id: string): string {
  return buildStakingId(token, user) + "-movement-" + id
}

function buildId(event: ethereum.Event): string {
  return event.transaction.hash.toHexString() + event.logIndex.toString()
}
