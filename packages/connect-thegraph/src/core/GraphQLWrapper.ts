import { Client } from '@urql/core'
import { DocumentNode } from 'graphql'
import { ParseFunction, QueryResult } from '../types'

export default class GraphQLWrapper {
  #client: Client
  #verbose: boolean

  constructor(subgraphUrl: string, verbose = false) {
    this.#client = new Client({
      maskTypename: true,
      url: subgraphUrl,
    })

    this.#verbose = verbose
  }

  async performQuery(
    query: DocumentNode,
    args: any = {}
  ): Promise<QueryResult> {
    const result = await this.#client.query(query, args).toPromise()

    if (this.#verbose) {
      console.log(this.describeQueryResult(result)) // Uncomment for debugging.
    }

    if (result.error) {
      throw new Error(
        `Error performing query.${this.describeQueryResult(result)}`
      )
    }

    return result
  }

  parseQueryResult(parser: ParseFunction, result: QueryResult): any {
    try {
      return parser(result)
    } catch (error) {
      throw new Error(`${error.message}${this.describeQueryResult(result)}`)
    }
  }

  private describeQueryResult(result: QueryResult): string {
    const queryStr = result.operation.query.loc?.source.body
    const dataStr = JSON.stringify(result.data, null, 2)
    const argsStr = JSON.stringify(result.operation.variables, null, 2)
    const subgraphUrl = result.operation.context.url

    return `\nSubgraph: ${subgraphUrl}\nArguments: ${argsStr}\nQuery: ${queryStr}Returned data: ${dataStr}`
  }
}
