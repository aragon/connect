import gql from 'graphql-tag'
import * as fragments from './fragments'

export const ORGANIZATION_APPS = gql`
  query Organization($orgAddress: String!) {
    organization(id: $orgAddress) {
      apps {
        ...App_app
      }
    }
  }
  ${fragments.APP_FRAGMENT}
`

export const APP_BY_ADDRESS = gql`
  query App($appAddress: String!) {
    app(id: $appAddress) {
      ...App_app
    }
  }
  ${fragments.APP_FRAGMENT}
`

export const REPO_BY_APP_ADDRESS = gql`
  query App($appAddress: String!) {
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

export const ORGANIZATION_PERMISSIONS = gql`
  query Organization($orgAddress: String!) {
    organization(id: $orgAddress) {
      permissions {
        ...Permission_permission
      }
    }
  }
  ${fragments.PERMISSION_FRAGMENT}
`

export const ROLE_BY_APP_ADDRESS = gql`
  query App($appAddress: String!) {
    app(id: $appAddress) {
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
