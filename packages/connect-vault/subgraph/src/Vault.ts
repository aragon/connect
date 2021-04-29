import { ethereum, Address, BigInt } from '@graphprotocol/graph-ts'

import { ERC20 as ERC20Contract } from '../generated/templates/Vault/ERC20'
import { VaultTransfer as TransferEvent, VaultDeposit as DepositEvent, Vault as VaultContract } from '../generated/templates/Vault/Vault'
import { Transaction as TransactionEntity, TokenBalance as TokenBalanceEntity, ERC20 as ERC20Entity, Vault as VaultEntity } from '../generated/schema'

function buildId(event: ethereum.Event): string {
  return event.transaction.hash.toHexString() + event.logIndex.toString()
}

function buildERC20(address: Address): string {
  const id = address.toHexString()
  let token = ERC20Entity.load(id)

  if (token === null) {
    const tokenContract = ERC20Contract.bind(address)
    token = new ERC20Entity(id)
    const optionalName = tokenContract.try_name();
    token.name = optionalName.reverted ? 'unknown name' : optionalName.value
    const optionalSymbol = tokenContract.try_symbol();
    token.symbol = optionalSymbol.reverted ? 'unknown symbol' : optionalSymbol.value
    const optionalDecimals = tokenContract.try_decimals();
    token.decimals = optionalDecimals.reverted ? 0 : optionalDecimals.value
    token.save()
  }

  return token.id
}

export function createVault(vaultAddress: Address, timestamp: BigInt): VaultEntity {
  const vaultApp = VaultContract.bind(vaultAddress)
  const vault = new VaultEntity(vaultAddress.toHexString())
  vault.dao = vaultApp.kernel()
  vault.createdAt = timestamp
  vault.save()
  return vault!
}

function _updateTokenBalance(transaction: TransactionEntity): void {
  const id = transaction.vault + "-token-" + transaction.token
  let balance = TokenBalanceEntity.load(id)

  if (balance === null) {
    balance = new TokenBalanceEntity(id)
    balance.vault = transaction.vault
    balance.token = transaction.token
    balance.balance = BigInt.fromI32(0)
  }

  if (transaction.type === 'Deposit') {
    balance.balance = balance.balance.plus(transaction.amount)
  } else {
    balance.balance = balance.balance.minus(transaction.amount)
  }

  balance.save()
}

export function handleDeposit(event: DepositEvent): void {
  const id = buildId(event)
  const transaction = new TransactionEntity(id)
  transaction.vault = event.address.toHexString()
  transaction.from = event.params.sender
  transaction.to = event.address
  transaction.token = buildERC20(event.params.token)
  transaction.amount = event.params.amount
  transaction.type = 'Deposit'
  transaction.createdAt = event.block.timestamp
  transaction.save()

  _updateTokenBalance(transaction)
}

export function handleTransfer(event: TransferEvent): void {
  const id = buildId(event)
  const transaction = new TransactionEntity(id)
  transaction.vault = event.address.toHexString()
  transaction.from = event.address
  transaction.to = event.params.to
  transaction.token = buildERC20(event.params.token)
  transaction.amount = event.params.amount
  transaction.type = 'Transfer'
  transaction.createdAt = event.block.timestamp
  transaction.save()

  _updateTokenBalance(transaction)
}

