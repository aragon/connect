import { OperationContext, OperationResult } from '@urql/core'

export type QueryResult = OperationResult<any>
export type DataGql = any

export type ParseFunction = (data: DataGql) => any

// From https://github.com/FormidableLabs/urql/blob/ca68584a578b9f85d0b1448fc7a5fc9587f968de/packages/core/src/exchanges/subscription.ts#L39-L44
export interface SubscriptionOperation {
  query: string
  variables?: object
  key: string
  context: OperationContext
}
