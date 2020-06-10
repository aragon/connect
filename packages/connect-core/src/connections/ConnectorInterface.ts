import Application from '../entities/Application'
import Permission from '../entities/Permission'
import Repository from '../entities/Repository'
import Role from '../entities/Role'

export interface ConnectorInterface {
  chainId?: number
  permissionsForOrg(orgAddress: string): Promise<Permission[]>
  onPermissionsForOrg(orgAddress: string, callback: Function): { unsubscribe: Function }
  appsForOrg(orgAddress: string): Promise<Application[]>
  onAppsForOrg(orgAddress: string, callback: Function): { unsubscribe: Function }
  repoForApp(appAddress: string): Promise<Repository>
  appByAddress(appAddress: string): Promise<Application>
  rolesForAddress(appAddress: string): Promise<Role[]>
}
