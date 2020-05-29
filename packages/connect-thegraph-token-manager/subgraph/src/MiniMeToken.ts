import { BigInt, Address } from '@graphprotocol/graph-ts'
import { Transfer as TransferEvent } from '../generated/templates/MiniMeToken/MiniMeToken'
import { TokenHolder as TokenHolderEntity } from '../generated/schema'
import { MiniMeToken as MiniMeTokenTemplate } from '../generated/templates'
import { MiniMeToken as MiniMeTokenEntity } from '../generated/schema'
import { MiniMeToken as MiniMeTokenContract } from '../generated/templates/MiniMeToken/MiniMeToken'
// import { ClaimedTokens as ClaimedTokensEvent } from '../generated/templates/MiniMeToken/MiniMeToken'
// import { NewCloneToken as NewCloneTokenEvent } from '../generated/templates/MiniMeToken/MiniMeToken'

export function createMiniMeTokenTemplateAndEntity(
  tokenManagerId: string,
  tokenManagerAddress: Address,
  orgAddress: Address,
  tokenAddress: Address
): void {
  MiniMeTokenTemplate.create(tokenAddress)

  let miniMeTokenEntity = _getMiniMeTokenEntity(tokenAddress)
  miniMeTokenEntity.tokenManager = tokenManagerId
  miniMeTokenEntity.orgAddress = orgAddress
  miniMeTokenEntity.appAddress = tokenManagerAddress

  miniMeTokenEntity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let tokenAddress = event.address
  let transferedAmount = event.params._amount

  let miniMeTokenEntity = _getMiniMeTokenEntity(tokenAddress)

  let sendingHolderAddress = event.params._from
  let sendingHolder = _getTokenHolder(miniMeTokenEntity, sendingHolderAddress)
  if (sendingHolder) {
    sendingHolder.balance = sendingHolder.balance.minus(transferedAmount)

    sendingHolder.save()
  }

  let receivingHolderAddress = event.params._to
  let receivingHolder = _getTokenHolder(miniMeTokenEntity, receivingHolderAddress)
  if (receivingHolder) {
    receivingHolder.balance = receivingHolder.balance.plus(transferedAmount)

    receivingHolder.save()
  }
}

// export function handleApproval(event: ApprovalEvent): void {}
// export function handleClaimedTokens(event: ClaimedTokensEvent): void {}
// export function handleNewCloneToken(event: NewCloneTokenEvent): void {}

function _getMiniMeTokenEntity(tokenAddress: Address): MiniMeTokenEntity {
  let miniMeTokenEntityId = 'tokenAddress-' + tokenAddress.toHexString()

  let miniMeTokenEntity = MiniMeTokenEntity.load(miniMeTokenEntityId)
  if (!miniMeTokenEntity) {
    miniMeTokenEntity = new MiniMeTokenEntity(miniMeTokenEntityId)
    miniMeTokenEntity.address = tokenAddress

    let tokenContract = MiniMeTokenContract.bind(tokenAddress)
    miniMeTokenEntity.name = tokenContract.name()
    miniMeTokenEntity.address = tokenAddress
    miniMeTokenEntity.symbol = tokenContract.symbol()
    miniMeTokenEntity.totalSupply = tokenContract.totalSupply()
    miniMeTokenEntity.transferable = tokenContract.transfersEnabled()
    miniMeTokenEntity.holders = new Array<string>()

    miniMeTokenEntity.save()
  }

  return miniMeTokenEntity!
}

function _getTokenHolder(miniMeTokenEntity: MiniMeTokenEntity, holderAddress: Address): TokenHolderEntity | null {
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
    tokenHolder.balance = tokenContract.balanceOf(holderAddress)

    let holders = miniMeTokenEntity.holders
    holders.push(tokenHolder.id)
    miniMeTokenEntity.holders = holders

    miniMeTokenEntity.save()
    tokenHolder.save()
  }

  return tokenHolder
}
