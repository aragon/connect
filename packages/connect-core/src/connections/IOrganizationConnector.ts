import {
  AppFilters,
  Network,
  SubscriptionCallback,
  SubscriptionHandler,
} from '@aragon/connect-types'
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

  connect?(connection: ConnectionContext): Promise<void>
  disconnect?(): Promise<void>

  appByAddress(organization: Organization, appAddress: string): Promise<App>

  appForOrg(organization: Organization, filters?: AppFilters): Promise<App>
  onAppForOrg(
    organization: Organization,
    filters: AppFilters,
    callback: SubscriptionCallback<App>
  ): SubscriptionHandler

  appsForOrg(organization: Organization, filters?: AppFilters): Promise<App[]>
  onAppsForOrg(
    organization: Organization,
    filters: AppFilters,
    callback: SubscriptionCallback<App[]>
  ): SubscriptionHandler

  permissionsForOrg(organization: Organization): Promise<Permission[]>
  onPermissionsForOrg(
    organization: Organization,
    callback: SubscriptionCallback<Permission[]>
  ): SubscriptionHandler

  repoForApp(organization: Organization, appAddress: string): Promise<Repo>

  rolesForAddress(
    organization: Organization,
    appAddress: string
  ): Promise<Role[]>
}
