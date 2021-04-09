import gql from 'graphql-tag'

const voteQueryString = (type: string, withCasts: boolean) => gql`
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
      ${
        withCasts ? 
        `castVotes {
          id
          supports
          stake
          createdAt
        }` : ``
      }
    }
  }
  `

export const ALL_VOTES = (type: string) => voteQueryString(type, false)

export const ALL_VOTES_WITH_CASTS = (type: string) => voteQueryString(type, true)

export const CASTS_FOR_VOTE = (type: string) => gql`
  ${type} Casts($vote: ID!, $first: Int!, $skip: Int!) {
    casts(where: { vote: $vote }, first: $first, skip: $skip) {
      id
      vote {
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
