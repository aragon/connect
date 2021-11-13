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
      originalCreator
      metadata
      executed
      executedAt
      startDate
      endDate
      snapshotBlock
      supportRequiredPct
      minAcceptQuorum
      yea
      nay
      votingPower
      isAccepted
      script
    }
  }
`

export const CASTS_FOR_VOTE = (type: string) => gql`
  ${type} Casts($vote: ID!, $first: Int!, $skip: Int!) {
    casts(where: { vote: $vote }, first: $first, skip: $skip) {
      id
      vote {
        id
        appAddress
        orgAddress
        creator
        originalCreator
        metadata
        executed
        executedAt
        startDate
        endDate
        snapshotBlock
        supportRequiredPct
        minAcceptQuorum
        yea
        nay
        votingPower
        isAccepted
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
