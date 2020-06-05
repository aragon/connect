import gql from 'graphql-tag'

export const ALL_VOTES = gql`
  query Votes($appAddress: String!, $first: Int!, $skip: Int!) {
    votes(where: {
      appAddress: $appAddress
    }, first: $first, skip: $skip) {
      id
      appAddress
      orgAddress
      creator
      metadata
      open
      executed
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

export const CASTS_FOR_VOTE = gql`
  query Casts($voteId: ID!, $first: Int!, $skip: Int!) {
    casts(where: {
      voteId: $voteId
    }, first: $first, skip: $skip) {
      id
      voteId
      voter
      supports
    }
  }
`
