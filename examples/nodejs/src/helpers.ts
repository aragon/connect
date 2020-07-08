import gql from 'graphql-tag'
import { ethers } from 'ethers'
import { GraphQLWrapper } from '@aragon/connect-thegraph'

export async function keepRunning() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, 1000000000)
  })
}

export async function fetchRepo(name: string, subgraph: string) {
  // Construct the query to fetch
  const QUERY = gql`
  query {
    repos(where:{
      name: "${name}"
    }) {
      id
    	name
    	lastVersion{
        codeAddress
        artifact
        semanticVersion
      }
    }
  }
  `

  // Create the GraphQL wrapper using the specific Subgraph URL
  const wrapper = new GraphQLWrapper(subgraph)

  // Invoke the custom query and receive data
  return wrapper.performQuery(QUERY)
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
        resolve(contractAddress)
      }
    })
  })
}
