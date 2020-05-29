import gql from 'graphql-tag'

export const ALL_VOTES = gql`
  query Votes($appAddress: String!) {
    votes(where: {
      appAddress: $appAddress
    }) {
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
  query Casts($voteId: ID!) {
    casts(where: {
      voteId: $voteId
    }) {
      id
      voteId
      voter
      supports
    }
  }
`
