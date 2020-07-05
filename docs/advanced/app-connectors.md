# Writing an App Connector

This section contains information about how our connectors for The Graph are built, and how to use one of the existing connectors as a template for your own Aragon app connector.

All existing connectors target all instances of a specific app, and can be deployed on any network. However, they can be modified to connect to any other Aragon app. In theory, they can be extended to connect to anything on chain, not just Aragon-related contracts.

## Architecture

The connectors are composed of a root project which implements a base connector for The Graph, and an underlying Subgraph. If you don’t have an app Subgraph yet, please refer to our [documentation for creating app Subgraphs](./app-subgraphs.md) and [The Graph’s documentation](https://thegraph.com/docs).

### The connector

The `src` folder contains a connector implementation for The Graph which uses `@aragon/connect-thegraph` to perform GraphQL queries, parse them, and present the result in the form of entity objects compatible with the `@aragon/connect` API.

Use `index.ts` to pick which entities and objects are exposed to other packages.

In `connector.ts`, add functions that the entities of your connector will use. For example, the `Vote` entity will call its `castsForVote(...): Promise<Cast[]>` function. These functions all follow the same structure of \(1\) performing a query, \(2\) parsing the results of a query, and \(3\) wrapping and returning the results in the appropriate entity.

Each of the steps described above is separated in the `entities`, `parsers`, and `queries` folders for clarity.

Queries are defined using [`graphql-tag`](https://github.com/apollographql/graphql-tag), which allows using fragments. [Fragments](https://graphql.org/learn/queries/#fragments) are useful when your queries become complicated and you want to reuse "fragments" of queries.

### The Subgraph

In the `subgraph` folder, you’ll find a separate project which defines the Subgraph which the connector implementation uses as its data source.

## Step by step guide

If you haven’t already created an app Subgraph yet, please follow the steps in our [documentation for creating app Subgraphs](./app-subgraphs.md) first. From now on, we’ll assume you have a Subgraph deployed!

### Create the Connector

Coming soon!

#### Define the queries

#### Call the queries from the connector

#### Define the entities

## Troubleshooting

For Subgraph related errors, see the [troubleshooting section in our app Subgraph documentation](./app-subgraphs.md#troubleshooting).
