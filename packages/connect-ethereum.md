# Ethereum Connector for Aragon Connect

## Usage

```javascript
const myorg = await connect('myorg', {
  connector: new ConnectorEthereum({
    provider: ethereumProvider,
    appStateReducer: (state, { eventName, appId, repoId }) => {},
  }),
})
```

