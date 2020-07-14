# Voting app

This is an Aragon app specific connector for the Voting app built using The Graph.

## Connector API

To create a new instance of the connector, you need the specific Voting app address and the Subgraph URL:

```javascript
import { Voting } from '@aragon/connect-thegraph-voting'

const voting = new Voting(VOTING_APP_ADDRESS, VOTING_APP_SUBGRAPH_URL)
```

Once you have an instance of the `Voting` object, you can use the following API to fetch data.

### voting\#votesForApp\(appAddress, first, skip\)

Get the list of votes in the provided Voting app.

| Name         | Type              | Description                            |
| ------------ | ----------------- | -------------------------------------- |
| `appAddress` | `String`          | Address of the Voting app.             |
| `first`      | `String`          | Pagination argument.                   |
| `skip`       | `String`          | Pagination argument.                   |
| returns      | `Promise<Vote[]>` | Result data parsed as a list of votes. |

### voting\#onVotesForApp\(appAddress, callback\)

Subscribe to the list of votes in the provided Voting app.

| Name         | Type       | Description                                  |
| ------------ | ---------- | -------------------------------------------- |
| `appAddress` | `String`   | Address of the Voting app.                   |
| `callback`   | `Function` | Callback function call on every data update. |
| returns      | `Function` | Unsubscribe function.                        |

### voting\#castsForVote\(voteId, first, skip\)

Get the list of cast votes for a vote.

| Name     | Type              | Description                            |
| -------- | ----------------- | -------------------------------------- |
| `voteId` | `String`          | Id of the Vote.                        |
| `first`  | `String`          | Pagination argument.                   |
| `skip`   | `String`          | Pagination argument.                   |
| returns  | `Promise<Cast[]>` | Result data parsed as a list of casts. |

### voting\#onCastsForVote\(appAddress, callback\)

Subscribe to the list of cast votes for a vote.

| Name       | Type       | Description                                  |
| ---------- | ---------- | -------------------------------------------- |
| `voteId`   | `String`   | Id of the Vote.                              |
| `callback` | `Function` | Callback function call on every data update. |
| returns    | `Function` | Unsubscribe function.                        |

## Subgraph schema

The Subgraph schema defines all of the available entities and attributes. It may be useful to gain a fuller, clearer picture of the information you can request.

```yaml
type Vote @entity {
  id: ID!
  orgAddress: Bytes!
  appAddress: Bytes!
  creator: Bytes!
  metadata: String!
  executed: Boolean!
  startDate: BigInt!
  snapshotBlock: BigInt!
  supportRequiredPct: BigInt!
  minAcceptQuorum: BigInt!
  yea: BigInt!
  nay: BigInt!
  votingPower: BigInt!
  script: Bytes!
  voteNum: BigInt!
  casts: [Cast!]!
}

type Cast @entity {
  id: ID!
  voteId: ID!
  voteNum: BigInt!
  voter: Bytes!
  supports: Boolean!
  voterStake: BigInt!
  vote: Vote! @derivedFrom(field: "casts")
}
```
