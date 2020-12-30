import { utils as ethersUtils } from 'ethers'

import { Abi } from '../types'

export function findMethodAbiFragment(
  abi: Abi,
  methodSignature: string
): ethersUtils.Fragment | undefined {
  if (methodSignature === 'fallback') {
    // Note that fallback functions in the ABI do not contain a `name` or `inputs` key
    return abi.find((method) => method.type === 'fallback')
  }

  // Is the given method a full signature, e.g. 'foo(arg1,arg2,...)'
  const fullMethodSignature =
    Boolean(methodSignature) &&
    methodSignature.includes('(') &&
    methodSignature.includes(')')

  const methodAbiFragment = abi
    .filter((method) => method.type === 'function')
    .find((method) => {
      // If the full signature isn't given, just find the first overload declared
      if (!fullMethodSignature) {
        return method.name === methodSignature
      }

      const currentParameterTypes = method.inputs.map(({ type }) => type)
      const currentMethodSignature = `${
        method.name
      }(${currentParameterTypes.join(',')})`
      return currentMethodSignature === methodSignature
    })

  return methodAbiFragment
}
