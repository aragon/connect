import gql from 'graphql-tag'

export const ALL_TRANSACTIONS = (type: string) => gql`
  ${type} Transactions($appAddress: String!, $first: Int!, $skip: Int!) {
    transactions(where: {
      appAddress: $appAddress
    }, first: $first, skip: $skip) {
      id
      appAddress
      orgAddress
      token
      entity
      isIncoming
      amount
      date
      reference
    }
  }
`

export const BALANCE_FOR_TOKEN = (type: string) => gql`
  ${type} TokenBalances($appAddress: String!, $tokenAddress: String!, $first: Int!, $skip: Int!) {
    tokenBalances(where: {
      token: $tokenAddress,
      appAddress: $appAddress
    }, first: $first, skip: $skip) {
      id
      orgAddress
      appAddress
      token
      balance
    }
  }
`
