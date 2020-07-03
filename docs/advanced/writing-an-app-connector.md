# Writing an App Connector

This section contains information about how our TheGraph connectors work, and how to use one of the existing connectors as a template for your own Aragon app connector.

All existing connectors target all instances of a specific app, and can be deployed on any network. However, they can be modified to connect to any other Aragon app. In theory, it can even be used to connect to anything Aragon related, not just apps.

## Architecture

The connectors are composed of a root project which implements the base TheGraph connector, and an underlying subgraph. If you don't have an app subgraph yet, please refer to our [documentation for creating app subgraphs](https://github.com/aragon/connect/tree/d2637378efddfe6c9349f416d2df3d972057264b/docs/app-subgraphs.md) and [TheGraph's documentation](https://thegraph.com/docs).

### The connector

The `src` folder contains the TheGraph connector wrapper which simply uses `@aragon/connect-thegraph` to perform GraphQL queries, parse them, and present them in the form of entity objects consistent with the `@aragon/connect` API.

Use `index.ts` to pick which entities and objects are exposed to other packages.

In `connector.ts`, add functions that the entities of your connector will use. For example, the Vote entity will call its `castsForVote(...): Promise<Cast[]>` function. These functions all follow the same structure of \(1\) performing a query, \(2\) parsing the results of a query, and \(3\) wrapping and returning the results in the appropriate entity.

Each of the steps described above is separated in the `entities`, `parsers`, and `queries` folders for clarity.

Queries are defined using `graphql-tag`, which allows using fragments. Fragments are useful for when your queries start getting complicated and you want to reuse chunks of code in them.

### The subgraph

In the `subgraph` folder, you'll find a separate project which defines the subgraph which the connector wrapper uses to obtain its data.

## Step by step guide for making a new connector

If you haven't already created an app subgraph yet, please follow the steps in [our documentation for creating app subgraphs](https://github.com/aragon/connect/tree/d2637378efddfe6c9349f416d2df3d972057264b/docs/app-subgraphs.md) first. From now on, we'll assume you have a subgraph deployed!

### Create the Connector

Coming soon!

#### Define the queries

#### Call the queries from the connector

#### Define the entities

## Troubleshooting

For subgraph related errors, see the [troubleshooting section in the app subgraph documentation](https://github.com/aragon/connect/tree/d2637378efddfe6c9349f416d2df3d972057264b/docs/app-subgraphs.md#troubleshooting).

