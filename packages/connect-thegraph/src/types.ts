import { OperationResult } from "@urql/core"

export type QueryResult = OperationResult<any>
export type DataGql = any

export type ParseFunction = (data: DataGql) => {}
