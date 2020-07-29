import { Address, BigInt, log } from '@graphprotocol/graph-ts'
import { Transfer as TransferEvent } from '../../../generated/templates/MiniMeToken/MiniMeToken'
import { TokenHolder as TokenHolderEntity } from '../../../generated/schema'
import { MiniMeToken as MiniMeTokenEntity } from '../../../generated/schema'
import { MiniMeToken as MiniMeTokenContract } from '../../../generated/templates/MiniMeToken/MiniMeToken'
import { Approval as ApprovalEvent } from '../../../generated/templates/MiniMeToken/MiniMeToken'
import { ClaimedTokens as ClaimedTokensEvent } from '../../../generated/templates/MiniMeToken/MiniMeToken'
import { NewCloneToken as NewCloneTokenEvent } from '../../../generated/templates/MiniMeToken/MiniMeToken'
import { getTokenManagerId, getTokenManagerEntity } from './../../TokenManager'
import { TokenManager as TokenManagerContract } from '../../../generated/templates/TokenManager/TokenManager'
import * as aragon from '../aragon'

export function handleTransfer(event: TransferEvent): void {
  let tokenAddress = event.address
  let transferedAmount = event.params._amount

  let previousBlock = event.block.number.minus(BigInt.fromI32(1))
  let miniMeTokenEntity = _getMiniMeTokenEntity(previousBlock, tokenAddress)

  let sendingHolderAddress = event.params._from
  let sendingHolder = _getTokenHolder(previousBlock, miniMeTokenEntity, sendingHolderAddress)
  if (sendingHolder) {
    sendingHolder.balance = sendingHolder.balance.minus(transferedAmount)

    sendingHolder.save()
  } else {
    miniMeTokenEntity.totalSupply = miniMeTokenEntity.totalSupply.plus(transferedAmount)
    miniMeTokenEntity.save()
  }

  let receivingHolderAddress = event.params._to
  let receivingHolder = _getTokenHolder(previousBlock, miniMeTokenEntity, receivingHolderAddress)
  if (receivingHolder) {
    receivingHolder.balance = receivingHolder.balance.plus(transferedAmount)

    receivingHolder.save()
  } else {
    miniMeTokenEntity.totalSupply = miniMeTokenEntity.totalSupply.minus(transferedAmount)
    miniMeTokenEntity.save()
  }
}

export function handleApproval(event: ApprovalEvent): void {}
export function handleClaimedTokens(event: ClaimedTokensEvent): void {}
export function handleNewCloneToken(event: NewCloneTokenEvent): void {}

function _getMiniMeTokenEntity(previousBlock: BigInt, tokenAddress: Address): MiniMeTokenEntity {
  let miniMeTokenEntityId = 'tokenAddress-' + tokenAddress.toHexString()

  let miniMeTokenEntity = MiniMeTokenEntity.load(miniMeTokenEntityId)
  if (!miniMeTokenEntity) {
    aragon.processToken(tokenAddress, false)

    miniMeTokenEntity = new MiniMeTokenEntity(miniMeTokenEntityId)
    miniMeTokenEntity.address = tokenAddress

    let tokenContract = MiniMeTokenContract.bind(tokenAddress)
    miniMeTokenEntity.name = tokenContract.name()
    miniMeTokenEntity.address = tokenAddress
    miniMeTokenEntity.symbol = tokenContract.symbol()
    miniMeTokenEntity.totalSupply = _getTotalSupplyAt(tokenContract, previousBlock)
    miniMeTokenEntity.transferable = tokenContract.transfersEnabled()
    miniMeTokenEntity.holders = new Array<string>()

    let tokenManagerAddress = tokenContract.controller()
    miniMeTokenEntity.tokenManager = getTokenManagerId(tokenManagerAddress)
    miniMeTokenEntity.appAddress = tokenManagerAddress

    // This token's associated TokenManager entity might not
    // be connected to the token. Since its 'token' property
    // is derived from MiniMeTokenEntity's, simply loading it and saving it
    // should trigger the refresh and connect the TokenManager to the MiniMeToken.
    let tokenManagerEntity = getTokenManagerEntity(tokenManagerAddress)
    tokenManagerEntity.save()

    let tokenManagerContract = TokenManagerContract.bind(tokenManagerAddress)
    miniMeTokenEntity.orgAddress = tokenManagerContract.kernel()

    miniMeTokenEntity.save()
  }

  return miniMeTokenEntity!
}

function _getTokenHolder(previousBlock: BigInt, miniMeTokenEntity: MiniMeTokenEntity, holderAddress: Address): TokenHolderEntity | null {
  if (holderAddress.toHexString() == '0x0000000000000000000000000000000000000000') {
    return null
  }

  let tokenAddress = miniMeTokenEntity.address as Address
  let tokenHolderId = 'tokenAddress-' + tokenAddress.toHexString() + '-holderAddress-' + holderAddress.toHexString()
  let tokenHolder = TokenHolderEntity.load(tokenHolderId)

  if (!tokenHolder) {
    tokenHolder = new TokenHolderEntity(tokenHolderId)
    tokenHolder.address = holderAddress
    tokenHolder.tokenAddress = tokenAddress as Address

    let tokenContract = MiniMeTokenContract.bind(tokenAddress)
    tokenHolder.balance = _getBalanceOfAt(tokenContract, holderAddress, previousBlock)

    let holders = miniMeTokenEntity.holders
    holders.push(tokenHolder.id)
    miniMeTokenEntity.holders = holders

    miniMeTokenEntity.save()
    tokenHolder.save()
  }

  return tokenHolder
}

function _getTotalSupplyAt(tokenContract: MiniMeTokenContract, blockNumber: BigInt): BigInt {
  let callResult = tokenContract.try_totalSupplyAt(blockNumber)
  if (callResult.reverted) {
    return BigInt.fromI32(0)
  } else {
    return callResult.value
  }
}

function _getBalanceOfAt(tokenContract: MiniMeTokenContract, holderAddress: Address, blockNumber: BigInt): BigInt {
  let callResult = tokenContract.try_balanceOfAt(holderAddress, blockNumber)
  if (callResult.reverted) {
    return BigInt.fromI32(0)
  } else {
    return callResult.value
  }
}

