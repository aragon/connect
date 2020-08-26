import { QueryResult } from '@aragon/connect-thegraph'

import { DisputableVotingData } from '../../types'

export function parseDisputableVoting(
  result: QueryResult
): DisputableVotingData {
  const disputableVoting = result.data.disputableVoting

  if (!disputableVoting) {
    throw new Error('Unable to parse disputable voting.')
  }

  return {
    id: disputableVoting.id,
    dao: disputableVoting.dao,
    token: disputableVoting.token.id,
    currentSettingId: disputableVoting.setting.id,
  }
}
