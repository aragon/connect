import { ErrorUnexpectedResult } from 'packages/connect-core/dist/cjs'
import { QueryResult } from 'packages/connect-thegraph/dist/cjs'
import Call from '../../models/Call'
import { CallData } from '../../types'

export function parseCalls(result: QueryResult): Call[] {
  const calls = result.data.calls

  if (!calls) {
    throw new ErrorUnexpectedResult('Unable to parse calls.')
  }

  const datas = calls.map(
    (call: any): CallData => {
      return {
        id: call.id,
        vote: call.vote,
        contract: call.contract,
        calldata: call.calldata,
      }
    }
  )

  return datas.map((data: CallData) => {
    return new Call(data)
  })
}
