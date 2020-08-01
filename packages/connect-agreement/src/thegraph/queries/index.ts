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
