import gql from 'graphql-tag'

export const ALL_VOTES = (type: string) => gql`
  ${type} Votes($appAddress: String!, $first: Int!, $skip: Int!) {
    votes(where: {
      appAddress: $appAddress
    }, first: $first, skip: $skip) {
      id
      appAddress
      orgAddress
      creator
      metadata
      executed
      executedAt
      startDate
      snapshotBlock
      supportRequiredPct
      minAcceptQuorum
      yea
      nay
      votingPower
      script
    }
  }
`

export const CASTS_FOR_VOTE = (type: string) => gql`
  ${type} Casts($vote: ID!, $first: Int!, $skip: Int!) {
    casts {
      id
      vote(where: { id: $vote }) {
        id
        appAddress
        orgAddress
        creator
        metadata
        executed
        executedAt
        startDate
        snapshotBlock
        supportRequiredPct
        minAcceptQuorum
        yea
        nay
        votingPower
        script
      }
      voter {
        id
        address
      }
      supports
      stake
      createdAt
    }
  }
`
