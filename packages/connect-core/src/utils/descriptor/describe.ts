import { providers as ethersProviders } from 'ethers'

import {
  tryEvaluatingRadspec,
  tryDescribingUpdateAppIntent,
  postprocessRadspecDescription,
} from '../radspec/index'
import { StepDecoded, StepDescribed, PostProcessDescription } from '../../types'
import App from '../../entities/App'
import Role from '../../entities/Role'
import Transaction from '../../entities/Transaction'

async function getRolesForApps(apps: App[]): Promise<Role[]> {
  const roles: Role[] = []
  for await (const app of apps) {
    const appRoles = await app.roles()
    appRoles.forEach((role) => roles.push(role))
  }

  return roles
}

export async function describeStep(
  step: StepDecoded,
  installedApps: App[],
  roles: Role[],
  provider: ethersProviders.Provider
): Promise<StepDescribed> {
  let decoratedStep
  // TODO: Add intent Basket support

  // Single transaction step
  // First see if the step can be handled with a specialized descriptor
  try {
    decoratedStep = await tryDescribingUpdateAppIntent(step, installedApps)
  } catch (err) {}

  // Finally, if the step wasn't handled yet, evaluate via radspec normally
  if (!decoratedStep) {
    try {
      decoratedStep = await tryEvaluatingRadspec(step, installedApps, provider)
    } catch (err) {}
  }

  // Annotate the description, if one was found
  if (decoratedStep?.description) {
    try {
      const {
        description,
        annotatedDescription,
      } = await postprocessRadspecDescription(
        decoratedStep.description,
        installedApps,
        roles
      )
      decoratedStep.description = description
      decoratedStep.annotatedDescription = annotatedDescription ?? []
    } catch (err) {}
  }

  if (decoratedStep?.children) {
    decoratedStep.children = await describePath(
      decoratedStep.children,
      installedApps,
      provider
    )
  }

  return decoratedStep || { ...step, description: '' }
}

/**
 * Use radspec to create a human-readable description for each step in the given `path`
 *
 */
export async function describePath(
  path: StepDecoded[],
  installedApps: App[],
  provider: ethersProviders.Provider
): Promise<StepDescribed[]> {
  const roles = await getRolesForApps(installedApps)
  return Promise.all(
    path.map(async (step) => describeStep(step, installedApps, roles, provider))
  )
}

export async function describeTransaction(
  transaction: Transaction,
  installedApps: App[],
  provider: ethersProviders.Provider
): Promise<PostProcessDescription> {
  if (!transaction.to) {
    throw new Error(`Could not describe transaction: missing 'to'`)
  }
  if (!transaction.data) {
    throw new Error(`Could not describe transaction: missing 'data'`)
  }

  let description
  try {
    description = await tryEvaluatingRadspec(
      transaction,
      installedApps,
      provider
    )

    const roles = await getRolesForApps(installedApps)

    if (description) {
      return postprocessRadspecDescription(
        description.description,
        installedApps,
        roles
      )
    }
  } catch (err) {
    throw new Error(`Could not describe transaction: ${err}`)
  }

  return {
    description,
  }
}
