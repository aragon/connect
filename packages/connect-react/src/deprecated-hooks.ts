import type { AppFiltersParam } from '@1hive/connect-types'
import { App, Organization, Permission, warn } from '@1hive/connect-core'
import { UseConnectResult } from './types'
import { useConnect } from './use-connect'
import { hash } from './utils'

export function useOrganization(): UseConnectResult<Organization | null> {
  warn(
    'useOrganization() is going to be deprecated in the next version. ' +
      'Please use useConnect() instead.'
  )
  return useConnect<Organization | null>((organization) => organization)
}

export function useApp(
  appsFilter?: AppFiltersParam
): UseConnectResult<App | null> {
  warn(
    'useApp() is going to be deprecated in the next version. ' +
      'Please use useConnect() instead.'
  )
  return useConnect<App | null>(
    (org) => org.onApp(appsFilter),
    [hash(appsFilter)]
  )
}

export function useApps(appsFilter?: AppFiltersParam): UseConnectResult<App[]> {
  warn(
    'useApps() is going to be deprecated in the next version. ' +
      'Please use useConnect() instead.'
  )
  return useConnect<App[]>((org) => org.onApps(appsFilter), [hash(appsFilter)])
}

export function usePermissions(): UseConnectResult<Permission[]> {
  warn(
    'usePermissions() is going to be deprecated in the next version. ' +
      'Please use useConnect() instead.'
  )
  return useConnect<Permission[]>((org) => org.onPermissions())
}
