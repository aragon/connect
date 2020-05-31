export declare type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export declare type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    BigInt: any;
    Bytes: any;
};
export declare type Query = {
    __typename?: 'Query';
    OrgFactory?: Maybe<OrgFactory>;
    RegistryFactory?: Maybe<RegistryFactory>;
};
export declare type RegistryFactory = {
    __typename?: 'RegistryFactory';
    /** RegistryFactory address */
    id: Scalars['ID'];
    address: Scalars['Bytes'];
    registryCount: Scalars['Int'];
    registries: Array<Registry>;
};
export declare type Registry = {
    __typename?: 'Registry';
    /** Registry address */
    id: Scalars['ID'];
    address: Scalars['Bytes'];
    name?: Maybe<Scalars['String']>;
    /** ENS node */
    node?: Maybe<Scalars['Bytes']>;
    repoCount: Scalars['Int'];
    repos: Array<Repo>;
    factory?: Maybe<RegistryFactory>;
};
export declare type Repo = {
    __typename?: 'Repo';
    /** Repo address */
    id: Scalars['ID'];
    address: Scalars['Bytes'];
    name: Scalars['String'];
    /** Repo ENS node */
    node: Scalars['Bytes'];
    /** Latests Version of this repo published to aragonPM */
    lastVersion?: Maybe<Version>;
    versions: Array<Version>;
    registry: Registry;
};
export declare type Version = {
    __typename?: 'Version';
    /** Concat repo address '-' semanticVersion */
    id: Scalars['ID'];
    /** Semver version number */
    semanticVersion: Scalars['String'];
    repoName: Scalars['String'];
    repoAddress: Scalars['Bytes'];
    /** Repo ENS node */
    repoNamehash: Scalars['Bytes'];
    /** App implementation address */
    codeAddress?: Maybe<Scalars['Bytes']>;
    /** Content URI, ipfs hash or html url */
    contentUri?: Maybe<Scalars['String']>;
    /** Artifact.json metadata */
    artifact?: Maybe<Scalars['String']>;
    /** Manifest.json metadata */
    manifest?: Maybe<Scalars['String']>;
    apps?: Maybe<Array<App>>;
};
export declare type OrgFactory = {
    __typename?: 'OrgFactory';
    /** OrgFactory address */
    id: Scalars['ID'];
    address: Scalars['Bytes'];
    orgCount: Scalars['Int'];
    organizations: Array<Organization>;
};
export declare type Organization = {
    __typename?: 'Organization';
    /** Kernel address */
    id: Scalars['ID'];
    address: Scalars['Bytes'];
    /** Acl address */
    acl: Scalars['Bytes'];
    /** Address of the recovery Vault instance */
    recoveryVault: Scalars['Bytes'];
    apps: Array<App>;
    permissions: Array<Permission>;
    factory?: Maybe<OrgFactory>;
};
export declare type App = {
    __typename?: 'App';
    /** App proxy address */
    id: Scalars['ID'];
    address: Scalars['Bytes'];
    /** ENS namehash of the aragonPM repo */
    appId: Scalars['String'];
    /** App base implementation entity */
    implementation: Implementation;
    /** Whether the app is Forwarder */
    isForwarder?: Maybe<Scalars['Boolean']>;
    /** Whether the app is upgradeable */
    isUpgradeable?: Maybe<Scalars['Boolean']>;
    /** Repo Version entity */
    version?: Maybe<Version>;
    repo?: Maybe<Repo>;
    repoName?: Maybe<Scalars['String']>;
    repoAddress?: Maybe<Scalars['Bytes']>;
    roles?: Maybe<Array<Role>>;
    organization: Organization;
};
export declare type Implementation = {
    __typename?: 'Implementation';
    /** Concat namespace '-' appId */
    id: Scalars['ID'];
    address: Scalars['Bytes'];
};
export declare type Role = {
    __typename?: 'Role';
    /** Concat app address '-' role hash */
    id: Scalars['ID'];
    /** Role ens namehash */
    roleHash: Scalars['Bytes'];
    /** Role manager address */
    manager?: Maybe<Scalars['Bytes']>;
    app: App;
    appAddress: Scalars['Bytes'];
    grantees?: Maybe<Array<Permission>>;
};
export declare type Permission = {
    __typename?: 'Permission';
    /** Concat of app address '-' role hash '-' grantee address */
    id: Scalars['ID'];
    appAddress: Scalars['Bytes'];
    role: Role;
    /** Role ens namehash */
    roleHash: Scalars['Bytes'];
    /** Address assigned the permissions */
    granteeAddress: Scalars['Bytes'];
    /** Whether the grantee is allowed by the permission */
    allowed: Scalars['Boolean'];
    /** List of parameters the permission has */
    params: Array<Param>;
};
export declare type Param = {
    __typename?: 'Param';
    /** Concat of param hash '-' index */
    id: Scalars['ID'];
    /** Argument id (uint8) */
    argumentId: Scalars['Int'];
    /** Operation type (uint8) */
    operationType: Scalars['Int'];
    /** Argument Value (uint240) */
    argumentValue: Scalars['BigInt'];
};
export declare type IpfsHash = {
    __typename?: 'IpfsHash';
    /** Ipfs hash */
    id: Scalars['ID'];
    /** Content ipfs hash */
    hash?: Maybe<Scalars['String']>;
};
//# sourceMappingURL=types.d.ts.map