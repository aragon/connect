import { QueryResult } from '@aragon/connect-thegraph'

import Staking from '../../models/Staking'
import StakingMovement from '../../models/StakingMovement'

export function parseStaking(result: QueryResult, connector: any): Staking {
  const staking = result.data.staking

  if (!staking) {
    throw new Error('Unable to parse staking.')
  }

  const { id, token, user, total, available, locked, challenged } = staking

  return new Staking(
    {
      id,
      user,
      total,
      available,
      locked,
      challenged,
      tokenId: token.id,
      tokenDecimals: token.decimals,
    },
    connector
  )
}

export function parseStakingMovements(
  result: QueryResult,
  connector: any
): StakingMovement[] {
  const movements = result.data.stakingMovements

  if (!movements) {
    throw new Error('Unable to parse movements.')
  }

  return movements.map((movement: any) => {
    const { id, staking, agreement, action, amount, actionState, collateralState, createdAt } = movement

    return new StakingMovement(
      {
        id,
        amount,
        actionState,
        collateralState,
        createdAt,
        stakingId: staking.id,
        tokenId: staking.token.id,
        tokenDecimals: staking.token.decimals,
        actionId: (action ? action.id : null),
        agreementId: (agreement ? agreement.id : null),
      },
      connector
    )
  })
}
