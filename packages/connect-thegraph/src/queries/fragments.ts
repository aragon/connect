import gql from 'graphql-tag'

export const PERMISSION_FRAGMENT = gql`
  fragment Permission_permission on Permission {
    appAddress
    allowed
    granteeAddress
    roleHash
    params {
      argumentId
      operationType
      argumentValue
    }
  }
`

export const ROLE_FRAGMENT = gql`
  fragment Role_role on Role {
    roleHash
    manager
    appAddress
    grantees {
      ...Permission_permission
    }
  }
  ${PERMISSION_FRAGMENT}
`

export const VERSION_FRAGMENT = gql`
  fragment Version_version on Version {
    semanticVersion
    codeAddress
    contentUri
    artifact
    manifest
  }
`

export const REPO_FRAGMENT = gql`
  fragment Repo_repo on Repo {
    address
    name
    node
    registry {
      address
    }
    lastVersion {
      ...Version_version
    }
    versions {
      ...Version_version
    }
  }
  ${VERSION_FRAGMENT}
`

export const APP_FRAGMENT = gql`
  fragment App_app on App {
    address
    appId
    isForwarder
    isUpgradeable
    repoName
    implementation {
      address
    }
    organization {
      address
    }
    version {
      ...Version_version
    }
    repo {
      ...Repo_repo
    }
    roles {
      ...Role_role
    }
  }
  ${/* VERSION_FRAGMENT is already included in REPO_FRAGMENT */ ''}
  ${REPO_FRAGMENT}
  ${ROLE_FRAGMENT}
`
