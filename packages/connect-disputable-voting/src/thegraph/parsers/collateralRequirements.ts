import { QueryResult } from '@aragon/connect-thegraph'

import CollateralRequirement from '../../models/CollateralRequirement'

function buildCollateralRequirement(collateralRequirement: any, connector: any): CollateralRequirement {
  const {
    id,
    voting,
    token,
    actionAmount,
    challengeAmount,
    challengeDuration,
    collateralRequirementId
  } = collateralRequirement

  const collateralRequirementData = {
    id,
    actionAmount,
    challengeAmount,
    challengeDuration,
    collateralRequirementId,
    votingId: voting.id,
    tokenId: token.id,
    tokenDecimals: token.decimals,
  }

  return new CollateralRequirement(collateralRequirementData, connector)
}

export function parseCollateralRequirement(
  result: QueryResult,
  connector: any
): CollateralRequirement {
  const collateralRequirement = result.data.collateralRequirement

  if (!collateralRequirement) {
    throw new Error('Unable to parse collateral requirement.')
  }

  return buildCollateralRequirement(collateralRequirement, connector)
}

export function parseCurrentCollateralRequirement(
  result: QueryResult,
  connector: any
): CollateralRequirement {
  const disputableVoting = result.data.disputableVoting

  if (!disputableVoting || !disputableVoting.collateralRequirement) {
    throw new Error('Unable to parse current collateral requirement.')
  }

  return buildCollateralRequirement(disputableVoting.collateralRequirement, connector)
}
