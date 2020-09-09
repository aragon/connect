import { QueryResult } from '@aragon/connect-thegraph'

import { DisputableVotingData } from '../../types'

export function parseDisputableVoting(
  result: QueryResult
): DisputableVotingData {
  const disputableVoting = result.data.disputableVoting

  if (!disputableVoting) {
    throw new Error('Unable to parse disputable voting.')
  }

  const { id, dao, agreement, token, setting, collateralRequirement } = disputableVoting

  return {
    id,
    dao,
    agreement,
    token: token.id,
    currentSettingId: setting.id,
    currentCollateralRequirementId: collateralRequirement.id,
  }
}
