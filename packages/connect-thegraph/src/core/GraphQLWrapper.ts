import fetch from 'isomorphic-unfetch'
import ws from 'isomorphic-ws'
import {
  Client,
  defaultExchanges,
  subscriptionExchange,
  createRequest,
} from '@urql/core'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { DocumentNode } from 'graphql'
import { pipe, subscribe } from 'wonka'
import { SubscriptionHandler } from '@aragon/connect-types'
import { ParseFunction, QueryResult, SubscriptionOperation } from '../types'

const AUTO_RECONNECT = true
const CONNECTION_TIMEOUT = 20 * 1000

function filterSubgraphUrl(url: string): [string, string] {
  if (!/^(?:https|wss):\/\//.test(url)) {
    throw new Error('Please provide a valid subgraph URL')
  }
  return [url.replace(/^wss/, 'https'), url.replace(/^https/, 'wss')]
}

export default class GraphQLWrapper {
  #client: Client
  #verbose: boolean
  close: () => void

  constructor(subgraphUrl: string, verbose = false) {
    const [urlHttp, urlWs] = filterSubgraphUrl(subgraphUrl)

    const subscriptionClient = new SubscriptionClient(
      urlWs,
      { reconnect: AUTO_RECONNECT, timeout: CONNECTION_TIMEOUT },
      ws
    )

    this.#client = new Client({
      maskTypename: true,
      url: urlHttp,
      fetch,
      exchanges: [
        ...defaultExchanges,
        subscriptionExchange({
          forwardSubscription: (operation: SubscriptionOperation) =>
            subscriptionClient.request(operation),
        }),
      ],
    })

    this.#verbose = verbose
    this.close = () => subscriptionClient.close()
  }

  subscribeToQuery(
    query: DocumentNode,
    args: any = {},
    callback: Function
  ): SubscriptionHandler {
    const request = createRequest(query, args)

    return pipe(
      this.#client.executeSubscription(request),
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

  subscribeToQueryWithParser(
    query: DocumentNode,
    args: any = {},
    callback: Function,
    parser: ParseFunction
  ): SubscriptionHandler {
    return this.subscribeToQuery(query, args, async (result: QueryResult) => {
      callback(await this.parseQueryResult(parser, result))
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
    return this.parseQueryResult(parser, result)
  }

  async parseQueryResult(
    parser: ParseFunction,
    result: QueryResult
  ): Promise<any> {
    try {
      return parser(result, this)
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
