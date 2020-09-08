# Voting app

This is an app connector for the Voting app (`voting.aragonpm.eth`). It only supports The Graph for now.

## Usage

To connect an app, you need to pass a voting app as a first parameter of the connectVoting() function:

```js
import connect from '@aragon/connect'
import connectVoting from '@aragon/connect-voting'

const org = await connect('myorg.aragonid.eth', 'thegraph')
const voting = await connectVoting(org.app('voting'))
```

It extends the `App` object, which means that every method and properties of [`App`](../api-reference/app.md) are also available on this object.

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

### Voting\#onVotes\(filters, callback\)

Subscribe to the list of votes in the Voting app. The callback is optional, not passing it will return a partially applied function.

| Name       | Type                                    | Description                                                                     |
| ---------- | --------------------------------------- | ------------------------------------------------------------------------------- |
| `filters`  | `Object`                                | Optional object allowing to filter the votes. See `Voting#votes()` for details. |
| `callback` | `(error: Error, votes: Vote[]) => void` | A callback that will get called every time the result gets updated.             |
| returns    | `{ unsubscribe: () => void }`           | Unsubscribe function.                                                           |

## Vote

A single `Vote` object contains the following properties:

| Name                 | Type      | Description                                                                                   |
| -------------------- | --------- | --------------------------------------------------------------------------------------------- |
| `id`                 | `String`  | Unique identifier for the vote.                                                               |
| `creator`            | `Address` | Address of the vote creator.                                                                  |
| `metadata`           | `String`  | An arbitrary string that can be used to describe the vote.                                    |
| `executed`           | `Boolean` | Whether the vote has been executed.                                                           |
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

### Vote\#onCasts\(filters, callback\)

Subscribe to the list of casted votes. The callback is optional, not passing it will return a partially applied function.

| Name       | Type                                    | Description                                                                   |
| ---------- | --------------------------------------- | ----------------------------------------------------------------------------- |
| `filters`  | `Object`                                | Optional object allowing to filter the votes. See `Vote#casts()` for details. |
| `callback` | `(error: Error, votes: Vote[]) => void` | A callback that will get called every time the result gets updated.           |
| returns    | `{ unsubscribe: () => void }`           | Unsubscribe function.                                                         |

## Cast

Represents a casted vote. This object contains the following properties:

| Name       | Type     | Description                            |
| ---------- | -------- | -------------------------------------- |
| `id`       | `String` | Unique identifier for the casted vote. |
| `voteId`   | `String` | Identifier of the vote. See `Vote#id`. |
| `voter`    | `String` | The address that casted the vote.      |
| `supports` | `String` | Whether or not the vote is positive.   |
