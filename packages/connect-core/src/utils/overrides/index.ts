import { getAppInfo } from './interfaces'
import { AragonArtifact } from '../../types'

export function getAragonOsInternalAppInfo(appId: string): AragonArtifact {
  return getAppInfo(appId, 'aragon')
}

export function getApmInternalAppInfo(appId: string): AragonArtifact {
  return getAppInfo(appId, 'apm')
}

export { hasAppInfo, getAppInfo } from './interfaces'
