# The Graph Connector for Aragon Connect

## Usage

```js
const myorg = await connect('myorg', {
  connector: new ConnectorTheGraph({
    daoSubgraphUrl: 'http://…',
    appSubgraphUrl: repoId => {
      return 'http://…'
    },
  }),
})
```
