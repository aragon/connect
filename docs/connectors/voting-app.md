# Voting app

This is an app connector for the Voting app (`voting.aragonpm.eth`). It only supports The Graph for now.

## API

To connect an app, you need to pass a voting app as a first parameter of the connectVoting() function:

```js
import connect from '@aragon/connect'
import connectVoting from '@aragon/connect-voting'

const org = connect('myorg.aragonid.eth', 'thegraph')
const voting = connectVoting(org.app('voting'))
```

It extends the `App` object, which means that every method and properties of [`App`](../api-reference/app.md) are also available on this object.

Once you have a `Voting` instance, you can use the following API to retrieve its data:

### Voting\#votes\(filters\)

Get the list of votes in the Voting app.

| Name            | Type              | Description                                   |
| --------------- | ----------------- | --------------------------------------------- |
| `filters`       | `Object`          | Optional object allowing to filter the votes. |
| `filters.first` | `Number`          | Maximum number of votes. Defaults to `1000`.  |
| `filters.skip`  | `Number`          | Skip a number of votes. Defaults to `0`.      |
| returns         | `Promise<Vote[]>` | The list of votes.                            |

### Voting\#onVotes\(filters, callback\)

Subscribe to the list of votes in the Voting app.

| Name            | Type                                    | Description                                                         |
| --------------- | --------------------------------------- | ------------------------------------------------------------------- |
| `filters`       | `Object`                                | Optional object allowing to filter the votes.                       |
| `filters.first` | `Number`                                | Maximum number of votes. Defaults to `1000`.                        |
| `filters.skip`  | `Number`                                | Skip a number of votes. Defaults to `0`.                            |
| `callback`      | `(error: Error, votes: Vote[]) => void` | A callback that will get called every time the result gets updated. |
| returns         | `{ unsubscribe: () => void }`           | Unsubscribe function.                                               |
