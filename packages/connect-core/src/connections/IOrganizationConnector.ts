import { AppFilters, Network, SubscriptionHandler } from '@aragon/connect-types'
import App from '../entities/App'
import Permission from '../entities/Permission'
import Repo from '../entities/Repo'
import Role from '../entities/Role'

export default interface IOrganizationConnector {
  readonly name: string
  readonly network: Network
  appByAddress(appAddress: string): Promise<App>
  appForOrg(orgAddress: string, filters?: AppFilters): Promise<App>
  appsForOrg(orgAddress: string, filters?: AppFilters): Promise<App[]>
  chainId?: string
  connect?: () => Promise<void>
  onAppsForOrg(
    orgAddress: string,
    filters: AppFilters,
    callback: Function
  ): SubscriptionHandler
  onAppForOrg(
    orgAddress: string,
    filters: AppFilters,
    callback: Function
  ): SubscriptionHandler
  onPermissionsForOrg(
    orgAddress: string,
    callback: Function
  ): SubscriptionHandler
  permissionsForOrg(orgAddress: string): Promise<Permission[]>
  repoForApp(appAddress: string): Promise<Repo>
  rolesForAddress(appAddress: string): Promise<Role[]>
}
