// required by urql, see https://github.com/FormidableLabs/urql/issues/283#issuecomment-500144070
import 'isomorphic-unfetch'

export { default as GraphQLWrapper } from './core/GraphQLWrapper'

export { ConnectorTheGraphConfig } from './connector'

import ConnectorTheGraph from './connector'
export default ConnectorTheGraph

export * from './types'
