import gql from 'graphql-tag'

export const ALL_BALANCES = (type: string) => gql`
  ${type} TokenBalances($appAddress: String!, $first: Int!, $skip: Int!) {
    tokenBalances(where: {
      vault: $appAddress
    }, first: $first, skip: $skip) {
      id
      balance
      token {
        id
        name
        symbol
        decimals
      }
    }
  }
`
