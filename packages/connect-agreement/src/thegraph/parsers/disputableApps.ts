import { QueryResult } from '@aragon/connect-thegraph'

import { DisputableAppData } from '../../types'
import DisputableApp from '../../models/DisputableApp'

function buildDisputableApp(disputableApp: any, connector: any): DisputableApp {
  const {
    id,
    address,
    agreement,
    currentCollateralRequirement,
    activated,
  } = disputableApp

  const disputableAppData: DisputableAppData = {
    id,
    address,
    activated,
    agreementId: agreement.id,
    currentCollateralRequirementId: currentCollateralRequirement.id,
  }

  return new DisputableApp(disputableAppData, connector)
}

export function parseDisputableApps(
  result: QueryResult,
  connector: any
): DisputableApp[] {
  const disputables = result.data.disputables

  if (!disputables) {
    throw new Error('Unable to parse disputable apps.')
  }

  return disputables.map((disputableApp: any) =>
    buildDisputableApp(disputableApp, connector)
  )
}
