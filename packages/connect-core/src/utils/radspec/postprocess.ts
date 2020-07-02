import { addressesEqual, ANY_ENTITY } from '../address'
import { getKernelNamespace } from '../kernel'
import App from '../../entities/App'
import Role from '../../entities/Role'
import { Annotation } from '../../transactions/TransactionRequest'

export interface PostProcessDescription {
  description: string
  annotatedDescription?: Annotation[]
}

interface CompiledTokens {
  description: string[]
  annotatedDescription: Annotation[]
}

type ProcessToken = [string, string, Annotation]

/**
 * Look for known addresses and roles in a radspec description and substitute them with a human string
 *
 * @param  {string} description
 * @return {Promise<Object>} Description and annotated description
 */
export async function postprocessRadspecDescription(
  description: string,
  apps: App[]
): Promise<PostProcessDescription> {
  const addressRegexStr = '0x[a-fA-F0-9]{40}'
  const addressRegex = new RegExp(`^${addressRegexStr}$`)
  const bytes32RegexStr = '0x[a-f0-9]{64}'
  const bytes32Regex = new RegExp(`^${bytes32RegexStr}$`)
  const combinedRegex = new RegExp(
    `\\b(${addressRegexStr}|${bytes32RegexStr})\\b`
  )

  const tokens = description
    .split(combinedRegex)
    .map(token => token.trim())
    .filter(token => token)

  if (tokens.length < 1) {
    return { description }
  }

  const roles: Role[] = []
  for (const app of apps) {
    const appRoles = await app.roles()
    roles.concat(appRoles)
  }

  const annotateAddress = (input: string): ProcessToken => {
    if (addressesEqual(input, ANY_ENTITY)) {
      return [
        input,
        '"Any account"',
        { type: 'any-account', value: ANY_ENTITY },
      ]
    }

    const app = apps.find(({ address }) => addressesEqual(address, input))
    if (app) {
      const replacement = `${app.name}${app.appId ? ` (${app.appId})` : ''}`
      return [input, `“${replacement}”`, { type: 'app', value: app }]
    }

    return [input, input, { type: 'address', value: input }]
  }

  const annotateBytes32 = (input: string): ProcessToken => {
    const role = roles.find(({ hash }) => hash === input)

    if (role && role.name) {
      return [input, `“${role.name}”`, { type: 'role', value: role }]
    }

    const app = apps.find(({ appId }) => appId === input)

    if (app) {
      // return the entire app as it contains APM package details
      return [input, `“${app.appName}”`, { type: 'apmPackage', value: app }]
    }

    const namespace = getKernelNamespace(input)
    if (namespace) {
      return [
        input,
        `“${namespace.name}”`,
        { type: 'kernelNamespace', value: namespace },
      ]
    }

    return [input, input, { type: 'bytes32', value: input }]
  }

  const annotateText = (input: string): ProcessToken => {
    return [input, input, { type: 'text', value: input }]
  }

  const annotatedTokens = tokens.map(token => {
    if (addressRegex.test(token)) {
      return annotateAddress(token)
    }
    if (bytes32Regex.test(token)) {
      return annotateBytes32(token)
    }
    return annotateText(token)
  })

  const compiled: CompiledTokens = annotatedTokens.reduce(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (acc, [_, replacement, annotation]) => {
      acc.description.push(replacement)
      acc.annotatedDescription.push(annotation)
      return acc
    },
    {
      annotatedDescription: [] as Annotation[],
      description: [] as string[],
    }
  )

  return {
    annotatedDescription: compiled.annotatedDescription,
    description: compiled.description.join(' '),
  }
}
