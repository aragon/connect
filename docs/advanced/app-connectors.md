# Writing an App Connector

This section contains information about how our connectors for The Graph are built, and how to use one of the existing connectors as a template for your own Aragon app connector.

All existing connectors target all instances of a specific app, and can be deployed on any network. However, they can be modified to connect to any other Aragon app. In theory, they can be extended to connect to anything on chain, not just Aragon-related contracts.

## Architecture

The connectors are composed of a root project which implements a base connector for The Graph, and an underlying Subgraph. If you don’t have an app Subgraph yet, please refer to our [documentation for creating app Subgraphs](app-subgraphs.md) and [The Graph’s documentation](https://thegraph.com/docs).

### The connector

The `src` folder contains a connector implementation for The Graph which uses `@aragon/connect-thegraph` to perform GraphQL queries, parse them, and present the result in the form of entity objects compatible with the `@aragon/connect` API.

Use `index.ts` to pick which entities and objects are exposed to other packages.

In `connector.ts`, add functions that the entities of your connector will use. For example, the `Vote` entity will call its `castsForVote(...): Promise<Cast[]>` function. These functions all follow the same structure of \(1\) performing a query, \(2\) parsing the results of a query, and \(3\) wrapping and returning the results in the appropriate entity.

Each of the steps described above is separated in the `entities`, `parsers`, and `queries` folders for clarity.

Queries are defined using [`graphql-tag`](https://github.com/apollographql/graphql-tag), which allows using fragments. [Fragments](https://graphql.org/learn/queries/#fragments) are useful when your queries become complicated and you want to reuse "fragments" of queries.

### The Subgraph

In the `subgraph` folder, you’ll find a separate project which defines the Subgraph which the connector implementation uses as its data source.

## Step by step guide

If you haven’t already created an app Subgraph yet, please follow the steps in our [documentation for creating app Subgraphs](app-subgraphs.md) first. From now on, we’ll assume you have a Subgraph deployed!

### Create the Connector

Implementing a connector consists of calling the `createAppConnector()`, which takes care of doing some necessary checks as well as passing contextual information to the callback.

This is how an app connector can get implemented in the simplest way:

```js
import { createAppConnector } from '@aragon/connect-core'

export default createAppConnector(() => ({
  total: () => fetchTotal(),
}))
```

From the point of view of a consumer of your connector, the resulting object will be a function that can get used to connect an app.

For example, this is how app authors can initiate a connection to the Voting app. In this example, `connectVoting` got returned by `createAppConnector()`:

```js
import connect from '@aragon/connect'
import connectVoting from '@aragon/connect-voting'

// Connect to an organization on mainnet via The Graph.
const org = await connect('myorg.aragonid.eth', 'thegraph')

// Get and connect to the voting app.
const voting = await connectVoting(org.app('voting'))

// Fetch the votes from the voting app.
const votes = await voting.votes()
```

Following the same example, this is how the connector for the Voting app is implemented:

```js
import { createAppConnector } from '@aragon/connect-core'
import Voting from './entities/Voting'
import VotingConnectorTheGraph, {
  subgraphUrlFromChainId,
} from './thegraph/connector'

export default createAppConnector(
  ({ app, config, connector, network, verbose }) => {
    if (connector !== 'thegraph') {
      console.warn(
        `Connector unsupported: ${connector}. Using "thegraph" instead.`
      )
    }

    return new MyAppConnector(
      new VotingConnectorTheGraph(
        config.subgraphUrl ?? subgraphUrlFromChainId(network.chainId),
        verbose
      ),
      app.address
    )
  }
)
```

#### `createAppConnector\(callback\)`

Here are the parameters passed to the `createAppConnector()` callback:

| Name        | Type                             | Description                                                                                                                                                                                 |
| ----------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app`       | [`App`](../api-reference/app.md) | The App instance passed to the connector.                                                                                                                                                   |
| `connector` | `String`                         | The identifier of the main connector, as defined in `connect()`. It is indicative: app connectors can use it to use the same mechanism on their side. For now, it can only be `"thegraph"`. |
| `network`   | `String`                         | The current network, as defined in `connect()`. App connectors should follow it or throw an error, as connecting to a different network will create unexpected results.                     |
| `verbose`   | `Boolean`                        | The verbosity status, as defined in `connect()`. It is indicative and app connectors might choose to ignore it.                                                                             |
| `config`    | `Object`                         | A configuration object passed to your connector by `appConnect()` (see below).                                                                                                              |

#### appConnect\(app, connector\)

The function returned by `createAppConnector()`, called by app authors, takes these parameters:

| Name        | Type                             | Description                                                                                                                                                                      |
| ----------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app`       | [`App`](../api-reference/app.md) | An app instance, generally returned by `Organization#app()` or `Organization#apps()`.                                                                                            |
| `connector` | `[String, Object]` or `String`   | Accepts a string describing the main source of your connector (e.g. `"thegraph"`). In its array form, it also accepts a configuration object that gets passed to your connector. |

## Troubleshooting

For Subgraph related errors, see the [troubleshooting section in our app Subgraph documentation](app-subgraphs.md#troubleshooting).
