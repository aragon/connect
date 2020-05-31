import { ConnectorInterface, Permission, App, Repo, Role } from '@aragon/connect-core';
import GraphQLWrapper from './core/GraphQLWrapper';
export declare type ConnectorTheGraphConfig = {
    daoSubgraphUrl?: string;
    verbose?: boolean;
};
export default class ConnectorTheGraph extends GraphQLWrapper implements ConnectorInterface {
    constructor({ daoSubgraphUrl, verbose, }?: ConnectorTheGraphConfig);
    rolesForAddress(appAddress: string): Promise<Role[]>;
    permissionsForOrg(orgAddress: string): Promise<Permission[]>;
    appsForOrg(orgAddress: string): Promise<App[]>;
    appByAddress(appAddress: string): Promise<App>;
    repoForApp(appAddress: string): Promise<Repo>;
}
//# sourceMappingURL=connector.d.ts.map