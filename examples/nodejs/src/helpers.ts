import gql from 'graphql-tag'
import { ethers } from 'ethers'
import { GraphQLWrapper } from '@aragon/connect-thegraph'

export async function keepRunning() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1000000000)
  })
}

const QUERY_REPO_BY_NAME = gql`
  query RepoData($name: String) {
    repos(where: { name: $name }) {
      id
      name
      lastVersion {
        codeAddress
        artifact
        semanticVersion
      }
    }
  }
`

export async function fetchRepo(name: string, subgraph: string) {
  // Create the GraphQL wrapper using the specific Subgraph URL
  const wrapper = new GraphQLWrapper(subgraph)

  // Invoke the custom query and receive data
  const { data } = await wrapper.performQuery(QUERY_REPO_BY_NAME, {
    name,
  })

  return data.repos[0]
}

export async function getOrgAddress(
  selectedFilter: string,
  templateContract: ethers.Contract,
  transactionHash: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const filter = templateContract.filters[selectedFilter]()

    templateContract.on(filter, (contractAddress, event) => {
      if (event.transactionHash === transactionHash) {
        templateContract.removeAllListeners()
        resolve(contractAddress)
      }
    })
  })
}
