import { QueryResult } from '@aragon/connect-thegraph'

import { CollateralRequirementData } from '../../types'
import CollateralRequirement from '../../models/CollateralRequirement'

function buildCollateralRequirement(
  collateralRequirement: any,
  connector: any
): CollateralRequirement {
  const {
    id,
    token,
    disputable,
    actionAmount,
    challengeAmount,
    challengeDuration,
  } = collateralRequirement

  const collateralRequirementData: CollateralRequirementData = {
    id,
    disputableAppId: disputable.id,
    tokenId: token.id,
    tokenDecimals: token.decimals,
    actionAmount,
    challengeAmount,
    challengeDuration,
  }

  return new CollateralRequirement(collateralRequirementData, connector)
}

export function parseCollateralRequirement(
  result: QueryResult,
  connector: any
): CollateralRequirement {
  const disputable = result.data.disputable

  if (!disputable || !disputable.currentCollateralRequirement) {
    throw new Error('Unable to parse collateral requirement.')
  }

  const { currentCollateralRequirement } = disputable
  return buildCollateralRequirement(currentCollateralRequirement, connector)
}
