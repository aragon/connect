# Ethereum Connector for Aragon Connect

## Usage

```js
const myorg = await connect('myorg', connector: new ConnectorEthereum({
    provider: ethereumProvider,
    appStateReducer: (state, { eventName, appId, repoId }) => {},
  }),
})
```
