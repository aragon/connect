// Generated with https://graphql-code-generator.com/#live-demo

// 1. Get schema from subgraph
// 2. Paste in generator (https://graphql-code-generator.com/#live-demo)
// 3. Add on top:
/*
    directive @entity on OBJECT
    directive @derivedFrom(field: String) on FIELD_DEFINITION
    scalar BigInt
    scalar Bytes
*/
// 4. Generate and paste output here


export type Maybe<T> = T | null
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  BigInt: any
  Bytes: any
}

export type TokenManager = {
  __typename?: 'TokenManager'
  id: Scalars['ID']
  address: Scalars['Bytes']
  orgAddress: Scalars['Bytes']
  token: MiniMeToken
}

export type MiniMeToken = {
  __typename?: 'MiniMeToken'
  id: Scalars['ID']
  address: Scalars['Bytes']
  totalSupply: Scalars['BigInt']
  transferable: Scalars['Boolean']
  name: Scalars['String']
  symbol: Scalars['String']
  orgAddress: Scalars['Bytes']
  appAddress: Scalars['Bytes']
  tokenManager: TokenManager
  holders: Array<TokenHolder>
}

export type TokenHolder = {
  __typename?: 'TokenHolder'
  id: Scalars['ID']
  address: Scalars['Bytes']
  tokenAddress: Scalars['Bytes']
  balance: Scalars['BigInt']
}

