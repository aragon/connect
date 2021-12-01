type CacheStoreCallback<T> = () => Promise<T>
type CacheStoreCached<T> = (
  id: string,
  callback: CacheStoreCallback<T>
) => Promise<T>

export function createCacheStore<T = string>(
  limit = 10
): {
  cachedIndex: (id: string) => number
  clear: () => void
  get: (id: string, callback: CacheStoreCallback<T>) => Promise<T>
  touch: (index: number) => void
} {
  const cache: [string, T][] = Array(limit)

  return {
    clear(): void {
      cache.length = 0
    },
    cachedIndex(id: string): number {
      return cache.findIndex((entry) => id === entry?.[0])
    },
    touch(index: number): void {
      cache.unshift(cache.splice(index, 1)[0])
    },
    async get(id: string, callback: CacheStoreCallback<T>): Promise<T> {
      let cachedIndex = this.cachedIndex(id)
      if (cachedIndex > -1) {
        this.touch(cachedIndex)
        return cache[0][1]
      }

      const data = await callback()

      // Prevents to cache the same value multiple times, in case the same
      // value gets loaded several times in parallel.
      cachedIndex = this.cachedIndex(id)
      if (cachedIndex > -1) {
        this.touch(cachedIndex)
        return cache[0][1]
      }

      cache.unshift([id, data])
      cache.length = limit

      return data
    },
  }
}
