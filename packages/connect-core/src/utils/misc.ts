export function toArrayEntry<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

type CacheStoreCallback<T> = () => Promise<T>
type CacheStoreCached<T> = (
  id: string,
  callback: CacheStoreCallback<T>
) => Promise<T>

export function createCacheStore<T = string>(
  limit: number = 10
): {
  cachedIndex: (id: string) => number
  clear: () => void
  get: (id: string, callback: CacheStoreCallback<T>) => Promise<T>
  touch: (index: number) => void
} {
  const cachedEntries: [string, T][] = Array(limit)

  return {
    clear(): void {
      cachedEntries.length = 0
    },
    cachedIndex(id: string): number {
      return cachedEntries.findIndex((entry) => entry && id === entry[0])
    },
    touch(index: number): void {
      cachedEntries.unshift(cachedEntries.splice(index, 1)[0])
    },
    async get(id: string, callback: CacheStoreCallback<T>): Promise<T> {
      let cachedIndex = this.cachedIndex(id)
      if (cachedIndex > -1) {
        this.touch(cachedIndex)
        return cachedEntries[cachedIndex][1]
      }

      const data = await callback()

      // Prevents to cache the same value multiple times, in case the same
      // value gets loaded several times in parallel.
      cachedIndex = this.cachedIndex(id)
      if (cachedIndex > -1) {
        this.touch(cachedIndex)
        return cachedEntries[cachedIndex][1]
      }

      cachedEntries.unshift([id, data])
      cachedEntries.length = limit

      return data
    },
  }
}
