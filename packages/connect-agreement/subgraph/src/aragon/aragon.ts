import { Address, DataSourceTemplate, log } from '@graphprotocol/graph-ts'
import { AragonInfo as AragonInfoEntity } from '../../generated/schema'
import { Kernel as KernelTemplate } from '../../generated/templates'
import { MiniMeToken as MiniMeTokenTemplate } from '../../generated/templates'
import * as hooks from '../aragon-hooks'

/* eslint-disable @typescript-eslint/no-use-before-define */

export function processOrg(orgAddress: Address): void {
  if (!_isRegistered(orgAddress, 'org')) {
    KernelTemplate.create(orgAddress)
    hooks.onOrgTemplateCreated(orgAddress)

    _registerEntity(orgAddress, 'org')
  }
}

export function processApp(appAddress: Address, appId: string): void {
  if (!_isRegistered(appAddress, 'app')) {
    const templateType = hooks.getTemplateForApp(appId)
    if (templateType) {
      DataSourceTemplate.create(templateType, [appAddress.toHexString()])
      hooks.onAppTemplateCreated(appAddress, appId)
    }

    _registerEntity(appAddress, 'app')
  }
}

export function processToken(tokenAddress: Address): void {
  if (!_isRegistered(tokenAddress, 'token')) {
    MiniMeTokenTemplate.create(tokenAddress)
    hooks.onTokenTemplateCreated(tokenAddress)

    _registerEntity(tokenAddress, 'token')
  }
}

function _isRegistered(address: Address, type: string): boolean {
  const aragon = _getAragonInfo()

  let entities: Address[]
  if (type == 'org') {
    entities = aragon.orgs as Address[]
  } else if (type == 'app') {
    entities = aragon.apps as Address[]
  } else if (type == 'token') {
    entities = aragon.tokens as Address[]
  } else {
    throw new Error('Invalid entity type ' + type)
  }

  return entities.includes(address)
}

function _registerEntity(address: Address, type: string): void {
  const aragon = _getAragonInfo()

  if (type == 'org') {
    const entities = aragon.orgs
    entities.push(address)
    aragon.orgs = entities
  } else if (type == 'app') {
    const entities = aragon.apps
    entities.push(address)
    aragon.apps = entities
  } else if (type == 'token') {
    const entities = aragon.tokens
    entities.push(address)
    aragon.tokens = entities
  } else {
    throw new Error('Invalid entity type ' + type)
  }

  aragon.save()
}

function _getAragonInfo(): AragonInfoEntity {
  const aragonId = 'THERE_CAN_ONLY_BE_ONE'

  let aragon = AragonInfoEntity.load(aragonId)
  if (!aragon) {
    aragon = new AragonInfoEntity(aragonId)

    aragon.orgs = []
    aragon.apps = []
    aragon.tokens = []

    aragon.save()
  }

  return aragon!
}
