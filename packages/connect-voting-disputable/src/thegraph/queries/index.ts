import gql from 'graphql-tag'

export const GET_DISPUTABLE_VOTING = (type: string) => gql`
  query DisputableVoting($disputableVoting: String!) {
    disputableVoting(id: $disputableVoting) {
      id
      dao
      token {
        id      
      }
      setting {
        id
      }
    }
  }
`

export const GET_CURRENT_SETTING = (type: string) => gql`
  query DisputableVoting($disputableVoting: String!) {
    disputableVoting(id: $disputableVoting) {
      setting {
        id
        settingId
        supportRequiredPct
        minimumAcceptanceQuorumPct
        executionDelay
        overruleWindow
        quietEndingPeriod
        quietEndingExtension
        createdAt
        voting {
          id
        }
      }
    }
  }
`

export const GET_SETTING = (type: string) => gql`
  query Setting($settingId: String!) {
    setting(id: $settingId) {
      id
      settingId
      supportRequiredPct
      minimumAcceptanceQuorumPct
      executionDelay
      overruleWindow
      quietEndingPeriod
      quietEndingExtension
      createdAt
      voting {
        id
      }
    }
  }
`

export const ALL_SETTINGS = (type: string) => gql`
  query Settings($disputableVoting: String!, $first: Int!, $skip: Int!) {
    settings(where: {
      voting: $disputableVoting
    }, first: $first, skip: $skip) {
      id
      settingId
      supportRequiredPct
      minimumAcceptanceQuorumPct
      executionDelay
      overruleWindow
      quietEndingPeriod
      quietEndingExtension
      createdAt
      voting {
        id
      }
    }
  }
`

export const GET_VOTE = (type: string) => gql`
  query Vote($voteId: String!) {
    vote(id: $voteId) {
      id
      voting { 
        id 
      }
      voteId
      duration
      creator
      context
      status
      actionId
      setting { 
        id 
      }
      startDate
      votingPower
      snapshotBlock
      yeas
      nays
      pausedAt
      pauseDuration
      quietEndingExtendedSeconds
      quietEndingSnapshotSupport
      script
    }
  }
`

export const ALL_VOTES = (type: string) => gql`
  query Votes($disputableVoting: String!, $first: Int!, $skip: Int!) {
    votes(where: {
      voting: $disputableVoting
    }, first: $first, skip: $skip) {
      id
      voting { 
        id 
      }
      voteId
      duration
      creator
      context
      status
      actionId
      setting { 
        id 
      }
      startDate
      votingPower
      snapshotBlock
      yeas
      nays
      pausedAt
      pauseDuration
      quietEndingExtendedSeconds
      quietEndingSnapshotSupport
      script
    }
  }
`

export const GET_CAST_VOTE = (type: string) => gql`
  query CastVote($castVoteId: String!) {
    castVote(id: $castVoteId) {
      id
      vote { 
        id 
      }
      voter { 
        id
      }
      caster
      supports
      stake
      createdAt
    }
  }
`

export const ALL_CAST_VOTES = (type: string) => gql`
  query CastVotes($voteId: ID!, $first: Int!, $skip: Int!) {
    castVotes(where: {
      vote: $voteId
    }, first: $first, skip: $skip) {
      id
      vote { 
        id 
      }
      voter { 
        id 
      }
      caster
      supports
      stake
      createdAt
    }
  }
`

export const GET_VOTER = (type: string) => gql`
  query Voter($voterId: String!) {
    voter(id: $voterId) {
      id
      address
      representative
      voting { 
        id
      }
    }
  }
`

export const GET_COLLATERAL_REQUIREMENT = (type: string) => gql`
  query CollateralRequirement($voteId: String!) {
    vote(id: $voteId) {
      collateralRequirement {
        id
        actionAmount
        challengeAmount
        challengeDuration
        vote {
          id
        }
        token {
          id
        }
      }
    }
  }
`
