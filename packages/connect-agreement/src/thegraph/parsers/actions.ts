import { QueryResult } from '@aragon/connect-thegraph'

import Action from '../../models/Action'

export function parseAction(result: QueryResult, connector: any): Action | null {
  const action = result.data.action

  if (!action) {
    return null
  }

  const { id, agreement, collateralRequirement, disputable, version, disputableActionId, context, createdAt } = action

  return new Action(
    {
      id,
      agreementId: agreement.id,
      versionId: version.id,
      disputableId: disputable.id,
      collateralRequirementId: collateralRequirement.id,
      disputableActionId,
      context,
      createdAt
    },
    connector
  )
}
