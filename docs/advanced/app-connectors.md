# Writing an App Connector

This section contains information about how our connectors for The Graph are built, and how to use one of the existing connectors as a template for your own Aragon app connector.

All existing connectors target all instances of a specific app, and can be deployed on any network. However, they can be modified to connect to any other Aragon app. In theory, they can be extended to connect to anything on chain, not just Aragon-related contracts.

## Architecture

The connectors are composed of a root project which implements a base connector for The Graph, and an underlying Subgraph. If you don’t have an app Subgraph yet, please refer to our [documentation for creating app Subgraphs](app-subgraphs.md) and [The Graph’s documentation](https://thegraph.com/docs).

### The connector

We are using and recommend the following structure to implement app connectors.

The `src` folder contains:

- `models` folder: objects compatible with the `@aragon/connect` API. This is what the consumers of your app connector are going to interact with.
- `thegraph` folder: a connector implementation for The Graph which uses `@aragon/connect-thegraph` to perform GraphQL queries, parse them and present the result in the form of models objects. This part is only used internally, and `connector.ts` contains the methods responsible to fetch the app data from The Graph.

Use `index.ts` to pick which models and objects are exposed to other packages.

Use `connect.ts` to create the connector logic [using `createAppConnector()`](#create-the-connector) from `'@aragon/connect-core'`.

In `thegraph/connector.ts` (assuming your connector is using The Graph), add functions that the models of your connector will use. For example, the `Vote` model of `@aragon/connect-voting` [will call its `castsForVote(...): Promise<Cast[]>` function](https://github.com/aragon/connect/blob/12dec7e5147220d29fb960bff01ff95e9ccca1bf/packages/connect-voting/src/models/Vote.ts#L39). These functions all follow the same structure of \(1\) performing a query, \(2\) parsing the results of a query, and \(3\) wrapping and returning the results in the appropriate model.

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
import Voting from './models/Voting'
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

    return new Voting(
      new VotingConnectorTheGraph(
        config.subgraphUrl ?? subgraphUrlFromChainId(network.chainId),
        verbose
      ),
      app.address
    )
  }
)
```

#### createAppConnector\(callback\)

Parameters passed to the `createAppConnector()` callback:

| Name        | Type                             | Description                                                                                                                                                                                 |
| ----------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app`       | [`App`](../api-reference/app.md) | The App instance passed to the connector.                                                                                                                                                   |
| `connector` | `String`                         | The identifier of the main connector, as defined in `connect()`. It is indicative: app connectors can use it to use the same mechanism on their side. For now, it can only be `"thegraph"`. |
| `network`   | `String`                         | The current network, as defined in `connect()`. App connectors should follow it or throw an error, as connecting to a different network will create unexpected results.                     |
| `verbose`   | `Boolean`                        | The verbosity status, as defined in `connect()`. It is indicative and app connectors might choose to ignore it.                                                                             |
| `config`    | `Object`                         | A configuration object passed to your connector by `appConnect()` (see below).                                                                                                              |

#### appConnect\(app, connector\)

The function returned by `createAppConnector()`, called by app authors. It takes these parameters:

| Name        | Type                             | Description                                                                                                                                                                      |
| ----------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app`       | [`App`](../api-reference/app.md) | An app instance, generally returned by `Organization#app()` or `Organization#apps()`.                                                                                            |
| `connector` | `[String, Object]` or `String`   | Accepts a string describing the main source of your connector (e.g. `"thegraph"`). In its array form, it also accepts a configuration object that gets passed to your connector. |

## Troubleshooting

For Subgraph related errors, see the [troubleshooting section in our app Subgraph documentation](app-subgraphs.md#troubleshooting).
