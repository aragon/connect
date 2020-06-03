import { Address } from '@graphprotocol/graph-ts'
import { TokenManager as TokenManagerContract } from '../generated/templates/TokenManager/TokenManager'
import { TokenManager as TokenManagerEntity } from '../generated/schema'
import { createMiniMeTokenTemplateAndEntity } from './MiniMeToken'
// import { NewVesting as NewVestingEvent } from '../generated/templates/TokenManager/TokenManager'
// import { RevokeVesting as RevokeVestingEvent } from '../generated/templates/TokenManager/TokenManager'
// import { ScriptResult as ScriptResultEvent } from '../generated/templates/TokenManager/TokenManager'
// import { RecoverToVault as RecoverToVaultEvent } from '../generated/templates/TokenManager/TokenManager'

export function onTokenManagerTemplateCreated(proxyAddress: Address): void {
  let tokenManagerEntity = _getTokenManagerEntity(proxyAddress)

  _createMiniMeTokenTemplate(tokenManagerEntity)
}

function _createMiniMeTokenTemplate(tokenManagerEntity: TokenManagerEntity): void {
  let tokenManagerContract = TokenManagerContract.bind(tokenManagerEntity.address as Address)

  let tokenAddress = tokenManagerContract.token()

  if (tokenAddress.toHexString() != '0x0000000000000000000000000000000000000000') {
    createMiniMeTokenTemplateAndEntity(
      tokenManagerEntity.id,
      tokenManagerEntity.address as Address,
      tokenManagerEntity.orgAddress as Address,
      tokenAddress
    )
  }
}

function _getTokenManagerEntity(proxyAddress: Address): TokenManagerEntity {
  let tokenManagerId = 'proxyAddress-' + proxyAddress.toHexString()

  let tokenManagerEntity = TokenManagerEntity.load(tokenManagerId)
  if (!tokenManagerEntity) {
    let tokenManagerEntity = new TokenManagerEntity(tokenManagerId)

    let tokenManagerContract = TokenManagerContract.bind(proxyAddress)

    tokenManagerEntity.address = proxyAddress
    tokenManagerEntity.orgAddress = tokenManagerContract.kernel()

    tokenManagerEntity.save()
  }

  return tokenManagerEntity!
}

// export function handleNewVesting(event: NewVestingEvent): void {}
// export function handleRevokeVesting(event: RevokeVestingEvent): void {}
// export function handleScriptResult(event: ScriptResultEvent): void {}
// export function handleRecoverToVault(event: RecoverToVaultEvent): void {}
