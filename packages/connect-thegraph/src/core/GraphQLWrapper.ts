import fetch from 'isomorphic-unfetch'
import { Client, createRequest } from '@urql/core'
import { DocumentNode } from 'graphql'
import { pipe, subscribe } from 'wonka'
import { SubscriptionHandler } from '@aragon/connect-types'
import { ParseFunction, QueryResult } from '../types'

const POLL_INTERVAL = 5 * 1000

export default class GraphQLWrapper {
  #client: Client
  #verbose: boolean

  constructor(subgraphUrl: string, verbose = false) {
    this.#client = new Client({
      maskTypename: true,
      url: subgraphUrl,
      fetch,
    })

    this.#verbose = verbose
  }

  close(): void {
    // Do nothing for now.
    // Will be used when GraphQL subscriptions will be added again.
  }

  subscribeToQuery<T>(
    query: DocumentNode,
    args: any = {},
    callback: Function
  ): SubscriptionHandler {
    const request = createRequest(query, args)

    return pipe(
      this.#client.executeQuery(request, {
        pollInterval: POLL_INTERVAL,
      }),
      subscribe((result: QueryResult) => {
        if (this.#verbose) {
          console.log(this.describeQueryResult(result))
        }

        if (result.error) {
          throw new Error(
            [
              'Error performing subscription.',
              `${result.error.name}: ${result.error.message}`,
              this.describeQueryResult(result),
            ].join('\n')
          )
        }

        callback(result)
      })
    )
  }

  subscribeToQueryWithParser<T>(
    query: DocumentNode,
    args: any = {},
    callback: Function,
    parser: ParseFunction
  ): SubscriptionHandler {
    return this.subscribeToQuery(query, args, async (result: QueryResult) => {
      callback(await this.parseQueryResult<T>(parser, result))
    })
  }

  async performQuery(
    query: DocumentNode,
    args: any = {}
  ): Promise<QueryResult> {
    const result = await this.#client.query(query, args).toPromise()

    if (this.#verbose) {
      console.log(this.describeQueryResult(result))
    }

    if (result.error) {
      throw new Error(
        this.describeQueryResultError(result) + this.describeQueryResult(result)
      )
    }

    return result
  }

  async performQueryWithParser<T>(
    query: DocumentNode,
    args: any = {},
    parser: ParseFunction
  ): Promise<T> {
    const result = await this.performQuery(query, args)
    return this.parseQueryResult<T>(parser, result)
  }

  async parseQueryResult<T>(
    parser: ParseFunction,
    result: QueryResult
  ): Promise<T> {
    try {
      return parser(result)
    } catch (error) {
      throw new Error(error.message + '\n\n' + this.describeQueryResult(result))
    }
  }

  private describeQueryResultError(result: QueryResult): string {
    if (!result.error) {
      return ''
    }
    return `${result.error.name}: ${result.error.message}\n\n`
  }

  private describeQueryResult(result: QueryResult): string {
    const queryStr = result.operation.query.loc?.source.body
    const dataStr = JSON.stringify(result.data, null, 2)
    const argsStr = JSON.stringify(result.operation.variables, null, 2)
    const subgraphUrl = result.operation.context.url

    return [
      `Subgraph: ${subgraphUrl}`,
      `Arguments: ${argsStr}`,
      `Query: ${queryStr}`,
      `Returned data: ${dataStr}`,
    ].join('\n\n')
  }
}
