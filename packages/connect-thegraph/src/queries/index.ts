import gql from 'graphql-tag'
import * as fragments from './fragments'

type Query = 'query' | 'subscription'

export const ORGANIZATION_APPS = (type: Query) => gql`
  ${type} Organization($orgAddress: String!, $appFilter: App_filter!, $first: Int) {
    organization(id: $orgAddress) {
      apps(where: $appFilter, first: $first) {
        ...App_app
      }
    }
  }
  ${fragments.APP_FRAGMENT}
`

export const APP_BY_ADDRESS = (type: Query) => gql`
  ${type} App($appAddress: String!) {
    app(id: $appAddress) {
      ...App_app
    }
  }
  ${fragments.APP_FRAGMENT}
`

export const REPO_BY_APP_ADDRESS = (type: Query) => gql`
  ${type} App($appAddress: String!) {
    app(id: $appAddress) {
      repo {
        ...Repo_repo
      }
      version {
        ...Version_version
      }
    }
  }
  ${fragments.REPO_FRAGMENT}
  ${fragments.VERSION_FRAGMENT}
`

export const ORGANIZATION_PERMISSIONS = (type: Query) => gql`
  ${type} Organization($orgAddress: String!) {
    organization(id: $orgAddress) {
      permissions {
        ...Permission_permission
      }
    }
  }
  ${fragments.PERMISSION_FRAGMENT}
`

export const ROLE_BY_APP_ADDRESS = (type: Query) => gql`
  ${type} App($appAddress: String!) {
    app(id: $appAddress) {
      appId
      version{
        ...Version_version
      }
      roles {
        ...Role_role
      }
    }
  }
  ${fragments.VERSION_FRAGMENT}
  ${fragments.ROLE_FRAGMENT}
`
