import { Address } from '@graphprotocol/graph-ts'
import { TokenManager as TokenManagerContract } from '../generated/templates/TokenManager/TokenManager'
import { TokenManager as TokenManagerEntity } from '../generated/schema'
// import { NewVesting as NewVestingEvent } from '../generated/templates/TokenManager/TokenManager'
// import { RevokeVesting as RevokeVestingEvent } from '../generated/templates/TokenManager/TokenManager'
// import { ScriptResult as ScriptResultEvent } from '../generated/templates/TokenManager/TokenManager'
// import { RecoverToVault as RecoverToVaultEvent } from '../generated/templates/TokenManager/TokenManager'

export function onTokenManagerTemplateCreated(proxyAddress: Address): void {
  _getTokenManagerEntity(proxyAddress)
}

export function getTokenManagerId(proxyAddress: Address): string {
  return 'proxyAddress-' + proxyAddress.toHexString()
}

function _getTokenManagerEntity(proxyAddress: Address): TokenManagerEntity {
  let tokenManagerId = getTokenManagerId(proxyAddress)

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

// These are commented out to improve sync performance
// export function handleNewVesting(event: NewVestingEvent): void {}
// export function handleRevokeVesting(event: RevokeVestingEvent): void {}
// export function handleScriptResult(event: ScriptResultEvent): void {}
// export function handleRecoverToVault(event: RecoverToVaultEvent): void {}
