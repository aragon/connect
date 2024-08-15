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
      snapshotBlock
      supportRequiredPct
      minAcceptQuorum
      yea
      nay
      votingPower
      script
      spec
      contract
      calldata
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
        snapshotBlock
        supportRequiredPct
        minAcceptQuorum
        yea
        nay
        votingPower
        script
        spec
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

export const REWARDS_FOR_VOTE = (type: string) => gql`
  ${type} Rewards($vote: ID!, $first: Int!, $skip: Int!) {
    rewards(where: { vote: $vote }, first: $first, skip: $skip) {
      id
      vote {
        id
      }
      token
      amount
      to
    }
  }
`

export const CALLS_FOR_VOTE = (type: string) => gql`
  ${type} Calls($vote: ID!, $first: Int!, $skip: Int!) {
    calls(where: { vote: $vote }, first: $first, skip: $skip) {
      id
      vote {
        id
      }
      contract
      calldata
    }
  }
`
