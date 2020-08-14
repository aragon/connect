import gql from 'graphql-tag'

export const TOKEN = (type: string) => gql`
  query MiniMeToken($tokenManagerAddress: String!) {
    miniMeTokens(where: {
      appAddress: $tokenManagerAddress
    }) {
      id
      address
      totalSupply
      transferable
      name
      symbol
      appAddress
      orgAddress
    }
  }
`

export const TOKEN_HOLDERS = (type: string) => gql`
  query TokenHolders($tokenAddress: String!, $first: Int!, $skip: Int!) {
    tokenHolders(where: {
      tokenAddress: $tokenAddress
    }, first: $first, skip: $skip) {
      id
      address
      balance
      tokenAddress
    }
  }
`
