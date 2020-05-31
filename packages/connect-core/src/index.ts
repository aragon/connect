export { ConnectorInterface } from './connections/ConnectorInterface'
export {
  default as ConnectorJson,
  ConnectorJsonConfig,
} from './connections/ConnectorJson'

// TODO: Use index.ts in src/wrappers instead?
export { default as Organization } from './entities/Organization'
export { default as App, AppData } from './entities/App'
export { default as Repo, RepoData } from './entities/Repo'
export { default as Role, RoleData } from './entities/Role'
export { default as Permission, PermissionData } from './entities/Permission'
