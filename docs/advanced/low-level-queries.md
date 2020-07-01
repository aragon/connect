# Answering questions with custom queries

The data that the subgraphs have, can be use to answer more complex questions. But you need a more complex query.
The avaiable connectors create a simplified abstraction over the data, implementing a subset of queries that in general cover most of use cases.

## Subgraph schemas

Understaning the schema of the subgraph we are going to fetch data from is key to ask the right questions. In the [Connectors Reference](../connectors/organization.md) section you can find the schema for each subgraph associated with the particular connector.

## Creating a custom query

You can create custom quries to exploit the full power of the data. Following is an example of how to do it:

```javascript
import gql from 'graphql-tag'
import { GraphQLWrapper } from '@aragon/connect-thegraph'

// Construct the query
const QUERY = `
query {
  votes(where:{
    appAddress: "${VOTING_APP_ADDRESS}"
  }) {
    id
    metadata
    creator
  }
}
`

// Create the GraphQL wrapper using the specific subgraph URL
const wrapper = new GraphQLWrapper(VOTING_SUBGRAPH_URL)

// Fetch the data performing the custom query
const results = await wrapper.performQuery(gql(QUERY))

const { votes } = results.data
```

{% hint style="warning" %}
We use `gql` a JavaScript template literal tag that parses GraphQL query strings into the standard GraphQL AST.
{% endhint %}

## Subscriptions

It is also possible to create custom queries for subscriptions:

```javascript
import gql from 'graphql-tag'
import { GraphQLWrapper } from '@aragon/connect-thegraph'

// Construct the query
const QUERY = `
query miniMeToken($id: String!, $address: String!) {
  miniMeToken(id: $id){
    id
    totalSupply
    holders(where: {address: $address}){
      address
      balance
    }
  }
}
`

// Create the GraphQL wrapper using the specific subgraph URL
const wrapper = new GraphQLWrapper(TOKEN_MANAGER_SUBGRAPH)

// Subscribe to receive data updates using a custom query
const subscription = wrapper.subscribeToQuery(
  gql(QUERY),
  {
    id: TOKEN_ID,
    address: ACCOUNT_ADDRES,
  },
  results => {
    // Handle the resutls after every new data udpate
    const { miniMeToken } = results.data
  }
)

// Stop receiving updates
subscription.unsubscribe()
```
