# Voting app

This is an app connector for the Voting app (`voting.aragonpm.eth`). It only supports The Graph for now.

## Usage

To connect a Voting app, you need to pass it to `connectVoting()`:

```js
import connect from '@1hive/connect'
import connectVoting from '@1hive/connect-voting'

const org = await connect('myorg.aragonid.eth', 'thegraph')
const voting = await connectVoting(org.app('voting'))
```

It extends the `App` object, which means that every method and property of [`App`](../api-reference/app.md) is also available on this object.

## connect\(app, connector\)

Connects and returns a `Voting` instance.

| Name        | Type                                   | Description                                                                                                                                            |
| ----------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `app`       | `App` or `Promise<App>`                | The app to extend with connected capabilities.                                                                                                         |
| `connector` | `["thegraph", Object]` or `"thegraph"` | Accepts either a string describing the desired connector (only `"thegraph"` for now), or a tuple to also pass a configuration object to the connector. |
| returns     | `Promise<Voting>`                      | An `Voting` instance (see below).                                                                                                                      |

It can throw the following errors:

| Error type                                                     | Description                                                                                                                 |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| [`ErrorInvalidApp`](./errors.md#error-invalid-app)             | Either the passed value is not a valid app object, or its name is not `voting`.                                             |
| [`ErrorInvalidConnector`](./errors.md#error-invalid-connector) | Either the connector configuration format is not valid, or the connector name is not supported.                             |
| [`ErrorInvalidNetwork`](./errors.md#error-invalid-network)     | A subgraph couldn’t be found with the current network. Pass a `subgraphUrl` directly, or use one of the supported networks. |

## Voting

An object representing the Voting app, returned by `connectVoting()`. Use the following API to retrieve its data:

### Voting\#votes\(filters\)

Get the list of votes in the Voting app.

| Name            | Type              | Description                                   |
| --------------- | ----------------- | --------------------------------------------- |
| `filters`       | `Object`          | Optional object allowing to filter the votes. |
| `filters.first` | `Number`          | Maximum number of votes. Defaults to `1000`.  |
| `filters.skip`  | `Number`          | Skip a number of votes. Defaults to `0`.      |
| returns         | `Promise<Vote[]>` | The list of votes.                            |

This method can throw one of the following errors:

| Error type                                                     | Description                                 |
| -------------------------------------------------------------- | ------------------------------------------- |
| [`ErrorUnexpectedResult`](./errors.md#error-unexpected-result) | The response seems incorrect.               |
| [`ErrorConnection`](./errors.md#error-connection)              | The connection to the remote source failed. |

### Voting\#onVotes\(filters, callback\)

Subscribe to the list of votes in the Voting app. The callback is optional, not passing it will return a partially applied function.

| Name       | Type                                    | Description                                                                     |
| ---------- | --------------------------------------- | ------------------------------------------------------------------------------- |
| `filters`  | `Object`                                | Optional object allowing to filter the votes. See `Voting#votes()` for details. |
| `callback` | `(error: Error, votes: Vote[]) => void` | A callback that will get called every time the result gets updated.             |
| returns    | `{ unsubscribe: () => void }`           | Unsubscribe function.                                                           |

The error passed to `callback` can be `null` (no error) or one of the following:

| Error type                                                     | Description                                 |
| -------------------------------------------------------------- | ------------------------------------------- |
| [`ErrorUnexpectedResult`](./errors.md#error-unexpected-result) | The data couldn’t be fetched.               |
| [`ErrorConnection`](./errors.md#error-connection)              | The connection to the remote source failed. |

## Vote

A single `Vote` object contains the following properties:

| Name                 | Type      | Description                                                                                   |
| -------------------- | --------- | --------------------------------------------------------------------------------------------- |
| `id`                 | `String`  | Unique identifier for the vote.                                                               |
| `creator`            | `Address` | Address of the vote creator.                                                                  |
| `metadata`           | `String`  | An arbitrary string that can be used to describe the vote.                                    |
| `executed`           | `Boolean` | Whether the vote has been executed.                                                           |
| `executedAt`         | `String`  | Block timestamp for the vote execution. .                                                     |
| `startDate`          | `String`  | The start date. Expressed in Unix time (seconds).                                             |
| `snapshotBlock`      | `String`  | Number of the block before the one in which the vote was created.                             |
| `supportRequiredPct` | `String`  | Percentage of positive votes required, compared to the negatives votes, for the vote to pass. |
| `minAcceptQuorum`    | `String`  | Percentage of positive votes required, compared to the total, for the vote to pass.           |
| `yea`                | `String`  | Total amount of tokens casted to a positive vote.                                             |
| `nay`                | `String`  | Total amount of tokens casted to a negative vote.                                             |
| `votingPower`        | `String`  | Amount of tokens available at the block `snapshotBlock`.                                      |
| `script`             | `String`  | EVM call script to be executed on vote approval.                                              |

And the following methods:

### Vote\#casts\(filters\)

Get the list of casted votes.

| Name            | Type              | Description                                   |
| --------------- | ----------------- | --------------------------------------------- |
| `filters`       | `Object`          | Optional object allowing to filter the votes. |
| `filters.first` | `Number`          | Maximum number of votes. Defaults to `1000`.  |
| `filters.skip`  | `Number`          | Skip a number of votes. Defaults to `0`.      |
| returns         | `Promise<Cast[]>` | The list of casted votes.                     |

This method can throw one of the following errors:

| Error type                                                     | Description                                 |
| -------------------------------------------------------------- | ------------------------------------------- |
| [`ErrorUnexpectedResult`](./errors.md#error-unexpected-result) | The response seems incorrect.               |
| [`ErrorConnection`](./errors.md#error-connection)              | The connection to the remote source failed. |

### Vote\#onCasts\(filters, callback\)

Subscribe to the list of casted votes. The callback is optional, not passing it will return a partially applied function.

| Name       | Type                                    | Description                                                                   |
| ---------- | --------------------------------------- | ----------------------------------------------------------------------------- |
| `filters`  | `Object`                                | Optional object allowing to filter the votes. See `Vote#casts()` for details. |
| `callback` | `(error: Error, votes: Vote[]) => void` | A callback that will get called every time the result gets updated.           |
| returns    | `{ unsubscribe: () => void }`           | Unsubscribe function.                                                         |

The error passed to `callback` can be `null` (no error) or one of the following:

| Error type                                                     | Description                                 |
| -------------------------------------------------------------- | ------------------------------------------- |
| [`ErrorUnexpectedResult`](./errors.md#error-unexpected-result) | The data couldn’t be fetched.               |
| [`ErrorConnection`](./errors.md#error-connection)              | The connection to the remote source failed. |

## Cast

Represents a casted vote. This object contains the following properties:

| Name        | Type     | Description                            |
| ----------- | -------- | -------------------------------------- |
| `id`        | `String` | Unique identifier for the casted vote. |
| `vote`      | `String` | The casted `Vote` object.              |
| `voter`     | `String` | The address that casted the vote.      |
| `supports`  | `String` | Whether or not the vote is positive.   |
| `stake`     | `String` | Voter stake for the casted vote.       |
| `createdAt` | `String` | Block timestamp for the casted vote.   |
