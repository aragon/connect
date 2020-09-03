import { ethereum, BigInt, Address } from '@graphprotocol/graph-ts'

import { Staking, StakingMovement } from '../generated/schema'
import { buildActionId, buildERC20 } from './Agreement'
import { Agreement as AgreementContract } from '../generated/templates/Agreement/Agreement'
import { Staked as StakedEvent, Unstaked as UnstakedEvent, Staking as StakingContract } from '../generated/templates/Staking/Staking'

/* eslint-disable @typescript-eslint/no-use-before-define */

export function handleStaked(event: StakedEvent): void {
  const stakingApp = StakingContract.bind(event.address)
  const token = stakingApp.token()

  const staking = loadOrCreateStaking(token, event.params.user)
  staking.total = staking.total.plus(event.params.amount)
  staking.available = staking.available.plus(event.params.amount)
  staking.save()

  const id = buildStakingMovementId(token, event.params.user, event.transaction.hash.toString())
  const movement = new StakingMovement(id)
  movement.amount = event.params.amount
  movement.staking = staking.id
  movement.actionState = 'NA'
  movement.collateralState = 'Available'
  movement.createdAt = event.block.timestamp
  movement.save()
}

export function handleUnstaked(event: UnstakedEvent): void {
  const stakingApp = StakingContract.bind(event.address)
  const token = stakingApp.token()

  const staking = loadOrCreateStaking(token, event.params.user)
  staking.total = staking.total.minus(event.params.amount)
  staking.available = staking.available.minus(event.params.amount)
  staking.save()

  const id = buildStakingMovementId(token, event.params.user, event.transaction.hash.toString())
  const movement = new StakingMovement(id)
  movement.amount = event.params.amount
  movement.staking = staking.id
  movement.actionState = 'NA'
  movement.collateralState = 'Withdrawn'
  movement.createdAt = event.block.timestamp
  movement.save()
}

export function createAgreementStakingMovement(agreement: Address, actionId: BigInt, type: string, event: ethereum.Event): void {
  const agreementApp = AgreementContract.bind(agreement)
  const actionData = agreementApp.getAction(actionId)
  const collateralData = agreementApp.getCollateralRequirement(actionData.value0, actionData.value2)

  const user = actionData.value4
  const token = collateralData.value0
  const collateralAmount = collateralData.value2
  const staking = loadOrCreateStaking(token, user)

  const id = buildStakingMovementId(token, user, event.transaction.hash.toString())
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
  } else if (type == 'accepted') {
    movement.amount = collateralAmount
    movement.actionState = 'Accepted'
    movement.collateralState = 'Available'
    staking.available = staking.available.plus(collateralAmount)
    staking.locked = staking.locked.minus(collateralAmount)
    staking.challenged = staking.challenged.minus(collateralAmount)
  } else { // voided
    movement.amount = collateralAmount
    movement.actionState = 'Voided'
    movement.collateralState = 'Available'
    staking.available = staking.available.plus(collateralAmount)
    staking.locked = staking.locked.minus(collateralAmount)
    staking.challenged = staking.challenged.minus(collateralAmount)
  }

  staking.save()
  movement.save()
}

function loadOrCreateStaking(token: Address, user: Address): Staking {
  buildERC20(token)

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
    staking.save()
  }

  return staking!
}

function buildStakingId(token: Address, user: Address): string {
  return token.toHexString() + "-user-" + user.toHexString()
}

function buildStakingMovementId(token: Address, user: Address, id: string): string {
  return buildStakingId(token, user) + "-movement-" + id
}
