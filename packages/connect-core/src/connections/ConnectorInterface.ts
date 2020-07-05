import App from '../entities/App'
import Permission from '../entities/Permission'
import Repo from '../entities/Repo'
import Role from '../entities/Role'
import { AppFilters } from '@aragon/connect-types'

export interface ConnectorInterface {
  appByAddress(appAddress: string): Promise<App>
  appForOrg(orgAddress: string, filters?: AppFilters): Promise<App>
  appsForOrg(orgAddress: string, filters?: AppFilters): Promise<App[]>
  chainId?: number
  onAppsForOrg(
    orgAddress: string,
    filters: AppFilters,
    callback: Function
  ): { unsubscribe: Function }
  onAppForOrg(
    orgAddress: string,
    filters: AppFilters,
    callback: Function
  ): { unsubscribe: Function }
  onPermissionsForOrg(
    orgAddress: string,
    callback: Function
  ): { unsubscribe: Function }
  permissionsForOrg(orgAddress: string): Promise<Permission[]>
  repoForApp(appAddress: string): Promise<Repo>
  rolesForAddress(appAddress: string): Promise<Role[]>
}
