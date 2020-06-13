import { useEffect, useState } from 'react'

export function useCancellableAsync<Result>(
  asyncCall: (stop: () => void) => Promise<Result | undefined>,
  deps: any[]
): [Result, boolean] {
  const [result, setResult] = useState<Result>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let cancelled = false
    const cancel = () => {
      cancelled = true
    }
    const stop = () => {
      cancelled = true
      setLoading(false)
    }

    setLoading(true)
    asyncCall(stop).then(result => {
      if (!cancelled) {
        setResult(result)
        setLoading(false)
      }
    })

    return cancel
  }, deps)

  return [result as Result, loading]
}
