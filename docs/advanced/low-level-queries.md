# Custom Subgraph queries

The data that the Subgraphs contain can be used to answer complex questions. While the available connectors create a simplified abstraction by implementing queries that cover the most generic use cases, you can go further by invoking your own queries.

## Subgraph schemas

To be able to fetch data from the Subgraph, we first have to understand their [GraphQL schemas](https://graphql.org/learn/schema/). You can find the schemas associated with each Subgraph included officially with Aragon Connect in the [Connectors Reference](../connectors/organizations.md) section.

## Creating a custom query

You can use any tool that supports GraphQL, but for simplicity in illustration, we have chosen [`graphql-tag`](https://github.com/apollographql/graphql-tag) in the following examples:

```javascript
import gql from 'graphql-tag'
import { GraphQLWrapper } from '@aragon/connect-thegraph'

// Construct the query
const QUERY = gql`
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

// Create the GraphQL wrapper using the specific Subgraph URL
const wrapper = new GraphQLWrapper(VOTING_SUBGRAPH_URL)

// Invoke the custom query and receive data
const results = await wrapper.performQuery(QUERY)

const { votes } = results.data
```

{% hint style="warning" %}
`gql` is exposed from `graphql-tag` and is a utility that parses strings into structured GraphQL query objects.
{% endhint %}

## Subscriptions

It is also possible to create a subscription to a custom query:

```javascript
import gql from 'graphql-tag'
import { GraphQLWrapper } from '@aragon/connect-thegraph'

// Construct the query
const QUERY = gql`
  query miniMeToken($id: String!, $address: String!) {
    miniMeToken(id: $id) {
      id
      totalSupply
      holders(where: { address: $address }) {
        address
        balance
      }
    }
  }
`

// Create the GraphQL wrapper using the specific Subgraph URL
const wrapper = new GraphQLWrapper(TOKEN_MANAGER_SUBGRAPH)

// Create the subscription and receive updates every time the data changes
const subscription = wrapper.subscribeToQuery(
  QUERY,
  {
    id: TOKEN_ID,
    address: ACCOUNT_ADDRES,
  },
  (error, results) => {
    if (error) throw error

    // Handle each new result
    const { miniMeToken } = results.data
  }
)

// Stop receiving updates
subscription.unsubscribe()
```
