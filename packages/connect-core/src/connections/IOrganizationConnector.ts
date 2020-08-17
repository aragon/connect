import { AppFilters, Network, SubscriptionHandler } from '@aragon/connect-types'
import { ConnectionContext } from '../types'
import App from '../entities/App'
import Organization from '../entities/Organization'
import Permission from '../entities/Permission'
import Repo from '../entities/Repo'
import Role from '../entities/Role'

export default interface IOrganizationConnector {
  readonly name: string
  readonly network: Network
  readonly config: { [key: string]: any }
  appByAddress(organization: Organization, appAddress: string): Promise<App>
  appForOrg(organization: Organization, filters?: AppFilters): Promise<App>
  appsForOrg(organization: Organization, filters?: AppFilters): Promise<App[]>
  connect?(connection: ConnectionContext): Promise<void>
  disconnect?(): Promise<void>
  onAppForOrg(
    organization: Organization,
    filters: AppFilters,
    callback: Function
  ): SubscriptionHandler
  onAppsForOrg(
    organization: Organization,
    filters: AppFilters,
    callback: Function
  ): SubscriptionHandler
  onPermissionsForOrg(
    organization: Organization,
    callback: Function
  ): SubscriptionHandler
  permissionsForOrg(organization: Organization): Promise<Permission[]>
  repoForApp(organization: Organization, appAddress: string): Promise<Repo>
  rolesForAddress(
    organization: Organization,
    appAddress: string
  ): Promise<Role[]>
}
