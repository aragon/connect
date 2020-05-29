import App from '../entities/App'
import Permission from '../entities/Permission'
import Repo from '../entities/Repo'
import Role from '../entities/Role'

// TODO: No functions should be optional.
// Made optional for now, so that we can develop one connector at a time.
// When making these non-optional, make sure to also:
//   * remove non-null assertions from Organization.ts (e.g. this.#connector.apps!(...)).
//   * remove similar non-null assertions all wrappers.
export interface ConnectorInterface {
  chainId?: number
  permissionsForOrg(orgAddress: string): Promise<Permission[]>
  appsForOrg?(orgAddress: string): Promise<App[]>
  repoForApp?(appAddress: string): Promise<Repo>
  appByAddress?(appAddress: string): Promise<App>
  rolesForAddress?(appAddress: string): Promise<Role[]>
}
