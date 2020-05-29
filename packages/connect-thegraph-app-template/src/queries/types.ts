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

export type Vote = {
   __typename?: 'Vote'
  id: Scalars['ID']
  creator: Scalars['Bytes']
  metadata: Scalars['String']
  open: Scalars['Boolean']
  executed: Scalars['Boolean']
  startDate: Scalars['BigInt']
  snapshotBlock: Scalars['BigInt']
  supportRequiredPct: Scalars['BigInt']
  minAcceptQuorum: Scalars['BigInt']
  yea: Scalars['BigInt']
  nay: Scalars['BigInt']
  votingPower: Scalars['BigInt']
  script: Scalars['Bytes']
  casts: Array<Cast>
}

export type Cast = {
   __typename?: 'Cast'
  id: Scalars['ID']
  voteId: Scalars['String']
  voter: Scalars['Bytes']
  supports: Scalars['Boolean']
  voterStake: Scalars['BigInt']
  vote: Vote
}

