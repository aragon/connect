import App from '../entities/App'
import Permission from '../entities/Permission'
import Repo from '../entities/Repo'
import Role from '../entities/Role'

export interface ConnectorInterface {
  chainId?: number
  permissionsForOrg(orgAddress: string): Promise<Permission[]>
  onPermissionsForOrg(orgAddress: string, callback: Function): { unsubscribe: Function }
  appsForOrg(orgAddress: string): Promise<App[]>
  onAppsForOrg(orgAddress: string, callback: Function): { unsubscribe: Function }
  repoForApp(appAddress: string): Promise<Repo>
  appByAddress(appAddress: string): Promise<App>
  rolesForAddress(appAddress: string): Promise<Role[]>
}
