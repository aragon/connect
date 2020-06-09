import fetch from 'isomorphic-unfetch'
import ws from 'ws'
import { Client, defaultExchanges, subscriptionExchange, createRequest } from '@urql/core'
import { SubscriptionOperation } from '@urql/core/dist/types/exchanges/subscription'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { DocumentNode } from 'graphql'
import { ParseFunction, QueryResult } from '../types'
import { pipe, subscribe } from 'wonka'

type SubscriptionCallback = (result: any) => void
type Subscription = {
  unsubscribe: () => void
}

export default class GraphQLWrapper {
  #client: Client
  #verbose: boolean

  constructor(subgraphUrl: string, verbose = false) {
    const subscriptionClient = new SubscriptionClient(
      subgraphUrl.replace('http', 'ws'),
      {
        reconnect: true,
        timeout: 20000
      },
      ws
    )

    this.#client = new Client({
      maskTypename: true,
      url: subgraphUrl,
      fetch,
      exchanges: [
        ...defaultExchanges,
        subscriptionExchange({
          forwardSubscription: (operation: SubscriptionOperation) => subscriptionClient.request(operation)
        })
      ]
    })

    this.#verbose = verbose
  }

  subscribeToQuery(
    query: DocumentNode,
    args: any = {},
    callback: SubscriptionCallback
  ): Subscription {
    const request = createRequest(query, args)

    return pipe(
      this.#client.executeSubscription(request),
      subscribe((result: QueryResult) => {
        if (this.#verbose) {
          console.log(this.describeQueryResult(result))
        }

        if (result.error) {
          throw new Error(
            `Error performing subscription.${this.describeQueryResult(result)}`
          )
        }

        callback(result)
      })
    )
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
