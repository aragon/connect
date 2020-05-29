// Is the given method a full signature, e.g. 'foo(arg1,arg2,...)'
export const isFullMethodSignature = (methodSignature: string): boolean => {
  return (
    Boolean(methodSignature) &&
    methodSignature.includes('(') &&
    methodSignature.includes(')')
  )
}
