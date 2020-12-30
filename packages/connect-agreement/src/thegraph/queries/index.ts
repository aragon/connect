import gql from 'graphql-tag'

export const GET_AGREEMENT = (type: string) => gql`
  ${type} Agreement($agreement: String!) {
    agreement(id: $agreement) {
      id
      dao
      stakingFactory
      currentVersion { 
        id 
      }
    }
  }
`

export const GET_CURRENT_VERSION = (type: string) => gql`  
  ${type} Agreement($agreement: String!) {
    agreement(id: $agreement) {
      currentVersion {
        id
        versionId
        content
        title
        arbitrator
        appFeesCashier
        effectiveFrom
      }
    }
  }
`

export const GET_VERSION = (type: string) => gql`  
  ${type} Version($versionId: String!) {
    version(id: $versionId) {
      id
      versionId
      content
      title
      arbitrator
      appFeesCashier
      effectiveFrom
    }
  }
`

export const ALL_VERSIONS = (type: string) => gql`
  ${type} Versions($agreement: String!, $first: Int!, $skip: Int!) {
    versions(where: {
      agreement: $agreement
    }, first: $first, skip: $skip) {
      id
      versionId
      content
      title
      arbitrator
      appFeesCashier
      effectiveFrom
    }
  }
`

export const ALL_DISPUTABLE_APPS = (type: string) => gql`
  ${type} DisputableApps($agreement: String!, $first: Int!, $skip: Int!) {
    disputables(where: {
      agreement: $agreement
    }, first: $first, skip: $skip) {
      id
      agreement {
        id
      }
      address
      activated
      currentCollateralRequirement {
        id
      }
    }
  }
`

export const GET_SIGNER = (type: string) => gql`
  ${type} Signer($signerId: String!) {
    signer(id: $signerId) {
      id
      address
      agreement { id }
    }
  }
`

export const GET_SIGNATURES = (type: string) => gql`
  ${type} Signatures($signerId: String!, $first: Int!, $skip: Int!) {
    signatures(where: { 
      signer: $signerId
    }, first: $first, skip: $skip) {
      id
      version { id }
      signer { id }
      createdAt
    }
  }
`

export const GET_COLLATERAL_REQUIREMENT = (type: string) => gql`
  ${type} CollateralRequirement($collateralRequirementId: String!) {
    collateralRequirement(id: $collateralRequirementId) {
      id
      actionAmount
      challengeAmount
      challengeDuration
      disputable {
        id
      }
      token {
        id
        symbol
        decimals
      }
    }
  }
`

export const GET_STAKING = (type: string) => gql`
  ${type} Staking($stakingId: String!) {
    staking(id: $stakingId) {
      id
      user
      token {
        id
        symbol
        decimals
      }
      available
      locked
      challenged
      total
    }
  }
`

export const GET_STAKING_MOVEMENTS = (type: string) => gql`
  ${type} StakingMovements($stakingId: String!, $agreementId: String!, $first: Int!, $skip: Int!) {
    stakingMovements(where: {
      staking: $stakingId,
      agreement: $agreementId,
    }, orderBy: createdAt, orderDirection: asc, first: $first, skip: $skip) {
      id
      staking {
        id
        token {
          id
          symbol
          decimals
        }
      }
      agreement {
        id
      }
      action {
        id
        disputableActionId
        disputable {
          address
        }
      }
      amount
      actionState
      collateralState
      createdAt
    }
  }
`

export const GET_ACTION = (type: string) => gql`
  ${type} Action($actionId: String!) {
    action(id: $actionId) {
      id
      agreement { 
        id 
      }
      disputable {
        id
      }
      version {
        id
      }
      collateralRequirement {
        id
      }
      disputableActionId
      context
      createdAt
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
