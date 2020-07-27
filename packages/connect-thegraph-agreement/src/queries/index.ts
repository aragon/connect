import gql from 'graphql-tag'

export const GET_VERSION = (type: string) => gql`  
  ${type} Version($versionId: String!, $first: Int!, $skip: Int!) {
    versions(where: {
      versionId: $versionId
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
