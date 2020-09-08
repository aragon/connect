import { QueryResult } from '@aragon/connect-thegraph'

import CollateralRequirement from '../../models/CollateralRequirement'

export function parseCollateralRequirement(
  result: QueryResult,
  connector: any
): CollateralRequirement {
  const vote = result.data.vote

  if (!vote || !vote.collateralRequirement) {
    throw new Error('Unable to parse collateral requirement.')
  }

  const { collateralRequirement } = vote
  return new CollateralRequirement(
    {
      id: collateralRequirement.id,
      voteId: collateralRequirement.vote.id,
      tokenId: collateralRequirement.token.id,
      tokenDecimals: collateralRequirement.token.decimals,
      actionAmount: collateralRequirement.actionAmount,
      challengeAmount: collateralRequirement.challengeAmount,
      challengeDuration: collateralRequirement.challengeDuration,
    },
    connector
  )
}
