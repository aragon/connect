import gql from 'graphql-tag'

export const GET_DISPUTABLE_VOTING = (type: string) => gql`
  ${type} DisputableVoting($disputableVoting: String!) {
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
  ${type} DisputableVoting($disputableVoting: String!) {
    disputableVoting(id: $disputableVoting) {
      setting {
        id
        settingId
        voteTime
        supportRequiredPct
        minimumAcceptanceQuorumPct
        delegatedVotingPeriod
        quietEndingPeriod
        quietEndingExtension
        executionDelay
        createdAt
        voting {
          id
        }
      }
    }
  }
`

export const GET_SETTING = (type: string) => gql`
  ${type} Setting($settingId: String!) {
    setting(id: $settingId) {
      id
      settingId
      voteTime
      supportRequiredPct
      minimumAcceptanceQuorumPct
      delegatedVotingPeriod
      quietEndingPeriod
      quietEndingExtension
      executionDelay
      createdAt
      voting {
        id
      }
    }
  }
`

export const ALL_SETTINGS = (type: string) => gql`
  ${type} Settings($disputableVoting: String!, $first: Int!, $skip: Int!) {
    settings(where: {
      voting: $disputableVoting
    }, first: $first, skip: $skip) {
      id
      settingId
      voteTime
      supportRequiredPct
      minimumAcceptanceQuorumPct
      delegatedVotingPeriod
      quietEndingPeriod
      quietEndingExtension
      executionDelay
      createdAt
      voting {
        id
      }
    }
  }
`

export const GET_VOTE = (type: string) => gql`
  ${type} Vote($voteId: String!) {
    vote(id: $voteId) {
      id
      voting { 
        id 
        token {
          decimals
        }
      }
      voteId
      creator
      context
      status
      actionId
      challengeId
      challenger
      challengeEndDate
      disputeId
      setting { 
        id 
        voteTime
        quietEndingExtension
      }
      startDate
      totalPower
      snapshotBlock
      yeas
      nays
      pausedAt
      pauseDuration
      quietEndingExtensionDuration
      quietEndingSnapshotSupport
      script
      settledAt
      disputedAt
      executedAt
      isAccepted
      submitterArbitratorFee {
        id
      }
      challengerArbitratorFee {
        id
      }
    }
  }
`

export const ALL_VOTES = (type: string) => gql`
  ${type} Votes($disputableVoting: String!, $first: Int!, $skip: Int!) {
    votes(where: {
      voting: $disputableVoting
    }, orderBy: startDate, orderDirection: asc, first: $first, skip: $skip) {
      id
      voting { 
        id 
        token {
          decimals
        }
      }
      voteId
      creator
      context
      status
      actionId
      challengeId
      challenger
      challengeEndDate
      disputeId
      setting { 
        id 
        voteTime
        quietEndingExtension
      }
      startDate
      totalPower
      snapshotBlock
      yeas
      nays
      pausedAt
      pauseDuration
      quietEndingExtensionDuration
      quietEndingSnapshotSupport
      script
      settledAt
      disputedAt
      executedAt
      isAccepted
      submitterArbitratorFee {
        id
      }
      challengerArbitratorFee {
        id  
      }
    }
  }
`

export const GET_CAST_VOTE = (type: string) => gql`
  ${type} CastVote($castVoteId: String!) {
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
  ${type} CastVotes($voteId: ID!, $first: Int!, $skip: Int!) {
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
  ${type} Voter($voterId: String!) {
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
  ${type} CollateralRequirement($voteId: String!) {
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
          decimals
        }
      }
    }
  }
`

export const GET_ARBITRATOR_FEE = (type: string) => gql`
  ${type} ArbitratorFee($arbitratorFeeId: String!) {
    arbitratorFee(id: $arbitratorFeeId) {
      id
      amount
      vote {
        id
      }
      token {
        id
        decimals
      }
    }
  }
`

export const GET_ERC20 = (type: string) => gql`
  ${type} ERC20($tokenAddress: String!) {
    erc20(id: $tokenAddress) {
      id
      name
      symbol
      decimals
    }
  }
`
