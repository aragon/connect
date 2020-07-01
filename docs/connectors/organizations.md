# Organizations Connector

This is the main connector of the Aragon Connect library. It is responsabile to parse the organizations data.

Currently a single flavor of this connector is avaiable, build-in the core library using The Graph. We have plans to keep including other flavors, like a Ethereum connector that reduce the state from blockchain events, or a SQL connector that fetch data from a database, etc.

## Connector Interface

The connector to be compatible with Aragon Connect library should implement the following interface:

```typescript
  chainId?: number
  permissionsForOrg(orgAddress: string): Promise<Permission[]>
  onPermissionsForOrg(orgAddress: string, callback: Function): { unsubscribe: Function }
  appsForOrg(orgAddress: string): Promise<App[]>
  onAppsForOrg(orgAddress: string, callback: Function): { unsubscribe: Function }
  repoForApp(appAddress: string): Promise<Repo>
  appByAddress(appAddress: string): Promise<App>
  rolesForAddress(appAddress: string): Promise<Role[]>
```

## The Graph Connector

This connectors is build using The Graph and realaying on the GraphQL technology to query the data.

### GraphQLWrapper

The Graph connector export the `GraphQLWrapper` object. The wrapper is useful when you want to create low level request and talk to GraphQL directly.

To create a wrapper instance you need to provide the subgraph URL endpoint:

```javascript
const wrapper = new GraphQLWrapper(SUBGRAPH_URL)
```

Once you have a wrapper instance you can use the followig API to create custom queries.

#### API

##### GraphQLWrapper\#performQuery\(query, args\)

Perform a GraphQL query.

| Name    | Type                   | Description                                       |
| :------ | :--------------------- | :------------------------------------------------ |
| `query` | `DocumentNode`         | GraphQL query parsed in the standard GraphQL AST. |
| `args`  | `any = {}`             | Arguments pass to fields in the query.            |
| returns | `Promise<QueryResult>` | Query result data.                                |

##### GraphQLWrapper\#performQueryWithParser\(query, args, parser\)

Perform a GraphQL query and parse the resul return.

| Name     | Type           | Description                                       |
| :------- | :------------- | :------------------------------------------------ |
| `query`  | `DocumentNode` | GraphQL query parsed in the standard GraphQL AST. |
| `args`   | `any = {}`     | Arguments pass to fields in the query.            |
| `parser` | `Function`     | Parser function.                                  |
| returns  | `Promise<any>` | Query result data parsed.                         |

##### GraphQLWrapper\#subscribeToQuery\(query, args, callback\)

Perform a GraphQL subscription.

| Name       | Type           | Description                                       |
| :--------- | :------------- | :------------------------------------------------ |
| `query`    | `DocumentNode` | GraphQL query parsed in the standard GraphQL AST. |
| `args`     | `any = {}`     | Arguments pass to fields in the query.            |
| `callback` | `Function`     | Callback function call on every data update.      |
| returns    | `Function`     | Unsubscribe function.                             |

##### GraphQLWrapper\#subscribeToQueryWithParser\(query, args, callback, parser\)

Perform a GraphQL subscription and parse the result return.

| Name       | Type           | Description                                       |
| :--------- | :------------- | :------------------------------------------------ |
| `query`    | `DocumentNode` | GraphQL query parsed in the standard GraphQL AST. |
| `args`     | `any = {}`     | Arguments pass to fields in the query.            |
| `callback` | `Function`     | Callback function call on every data update.      |
| `parser`   | `Function`     | Parser function.                                  |
| returns    | `Function`     | Unsubscribe function.                             |

### Subgraph Schema

The subgraph schema show all the avaiable entities and atributes. It could be useful to have a better picture of the kind of information you can request.

Following is a picture of the graph of dependencies of the subgraph:

![](../assets/org-schema.png)
