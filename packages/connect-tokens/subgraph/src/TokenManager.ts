import { Address } from '@graphprotocol/graph-ts'
import { TokenManager as TokenManagerContract } from '../generated/templates/TokenManager/TokenManager'
import { TokenManager as TokenManagerEntity } from '../generated/schema'
import { OrphanTokenManagers as OrphanTokenManagersEntity } from '../generated/schema'
// import { NewVesting as NewVestingEvent } from '../generated/templates/TokenManager/TokenManager'
// import { RevokeVesting as RevokeVestingEvent } from '../generated/templates/TokenManager/TokenManager'
// import { ScriptResult as ScriptResultEvent } from '../generated/templates/TokenManager/TokenManager'
// import { RecoverToVault as RecoverToVaultEvent } from '../generated/templates/TokenManager/TokenManager'
import * as aragon from './aragon/aragon'

export function getTokenManagerId(proxyAddress: Address): string {
  return 'proxyAddress-' + proxyAddress.toHexString()
}

export function getTokenManagerEntity(
  proxyAddress: Address
): TokenManagerEntity {
  let tokenManagerId = getTokenManagerId(proxyAddress)

  let tokenManagerEntity = TokenManagerEntity.load(tokenManagerId)
  if (!tokenManagerEntity) {
    let tokenManagerEntity = new TokenManagerEntity(tokenManagerId)

    let tokenManagerContract = TokenManagerContract.bind(proxyAddress)

    tokenManagerEntity.address = proxyAddress
    tokenManagerEntity.orgAddress = tokenManagerContract.kernel()

    let tokenAddress: Address
    // See if the TokenManager is already initialized with a token.
    // If it's not, remember it so that we can check later.
    let callResult = tokenManagerContract.try_token()
    if (callResult.reverted) {
      tokenAddress = Address.fromString(
        '0x0000000000000000000000000000000000000000'
      )
    } else {
      tokenAddress = callResult.value
    }

    if (
      tokenAddress.toHexString() != '0x0000000000000000000000000000000000000000'
    ) {
      aragon.processToken(tokenAddress)
    } else {
      _registerOrphanTokenManager(proxyAddress)
    }

    tokenManagerEntity.save()
  }

  return tokenManagerEntity!
}

export function processOrphanTokenManagers(): void {
  let registry = _getOrphanTokenManagersEntity()

  let apps = registry.apps
  if (apps.length > 0) {
    for (let i = 0; i < apps.length; i++) {
      let proxyAddress = apps[i] as Address

      let tokenManagerContract = TokenManagerContract.bind(proxyAddress)

      let tokenAddress: Address

      let callResult = tokenManagerContract.try_token()
      if (callResult.reverted) {
        tokenAddress = Address.fromString(
          '0x0000000000000000000000000000000000000000'
        )
      } else {
        tokenAddress = callResult.value
      }

      if (
        tokenAddress.toHexString() !=
        '0x0000000000000000000000000000000000000000'
      ) {
        _unregisterOrphanTokenManager(proxyAddress)

        aragon.processToken(tokenAddress)
      }
    }
  }
}

function _registerOrphanTokenManager(appAddress: Address): void {
  let registry = _getOrphanTokenManagersEntity()

  let apps = registry.apps
  if (!apps.includes(appAddress)) {
    apps.push(appAddress)

    registry.apps = apps

    registry.save()
  }
}

function _unregisterOrphanTokenManager(appAddress: Address): void {
  let registry = _getOrphanTokenManagersEntity()

  let apps = registry.apps
  if (apps.includes(appAddress)) {
    let idx = apps.indexOf(appAddress)
    apps.splice(idx, 1)

    registry.apps = apps

    registry.save()
  }
}

function _getOrphanTokenManagersEntity(): OrphanTokenManagersEntity {
  let registryId = 'Singleton_OrphanTokenManagers'

  let registry = OrphanTokenManagersEntity.load(registryId)
  if (!registry) {
    registry = new OrphanTokenManagersEntity(registryId)

    registry.apps = []

    registry.save()
  }

  return registry!
}

// These are commented out to improve sync performance
// export function handleNewVesting(event: NewVestingEvent): void {}
// export function handleRevokeVesting(event: RevokeVestingEvent): void {}
// export function handleScriptResult(event: ScriptResultEvent): void {}
// export function handleRecoverToVault(event: RecoverToVaultEvent): void {}
