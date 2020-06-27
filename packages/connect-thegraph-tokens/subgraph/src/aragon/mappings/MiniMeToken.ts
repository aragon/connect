import { Address, BigInt, log } from '@graphprotocol/graph-ts'
import { Transfer as TransferEvent } from '../../../generated/templates/MiniMeToken/MiniMeToken'
import { TokenHolder as TokenHolderEntity } from '../../../generated/schema'
import { MiniMeToken as MiniMeTokenEntity } from '../../../generated/schema'
import { MiniMeToken as MiniMeTokenContract } from '../../../generated/templates/MiniMeToken/MiniMeToken'
import { Approval as ApprovalEvent } from '../../../generated/templates/MiniMeToken/MiniMeToken'
import { ClaimedTokens as ClaimedTokensEvent } from '../../../generated/templates/MiniMeToken/MiniMeToken'
import { NewCloneToken as NewCloneTokenEvent } from '../../../generated/templates/MiniMeToken/MiniMeToken'
import { getTokenManagerId } from './../../TokenManager'
import { TokenManager as TokenManagerContract } from '../../../generated/templates/TokenManager/TokenManager'

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
    miniMeTokenEntity = new MiniMeTokenEntity(miniMeTokenEntityId)
    miniMeTokenEntity.address = tokenAddress

    let tokenContract = MiniMeTokenContract.bind(tokenAddress)
    miniMeTokenEntity.name = tokenContract.name()
    miniMeTokenEntity.address = tokenAddress
    miniMeTokenEntity.symbol = tokenContract.symbol()
    miniMeTokenEntity.totalSupply = tokenContract.totalSupplyAt(previousBlock)
    miniMeTokenEntity.transferable = tokenContract.transfersEnabled()
    miniMeTokenEntity.holders = new Array<string>()

    let tokenManagerAddress = tokenContract.controller()
    miniMeTokenEntity.tokenManager = getTokenManagerId(tokenManagerAddress)
    miniMeTokenEntity.appAddress = tokenManagerAddress

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
    let callResult = tokenContract.try_balanceOfAt(holderAddress, previousBlock)
    if (callResult.reverted) {
      log.info('balanceOfAt reverted - token {}, holder {}, block {}', [
        tokenAddress.toHexString(),
        holderAddress.toHexString(),
        previousBlock.toString()
      ])
      tokenHolder.balance = BigInt.fromI32(0)
    } else {
      tokenHolder.balance = callResult.value
    }

    let holders = miniMeTokenEntity.holders
    holders.push(tokenHolder.id)
    miniMeTokenEntity.holders = holders

    miniMeTokenEntity.save()
    tokenHolder.save()
  }

  return tokenHolder
}
