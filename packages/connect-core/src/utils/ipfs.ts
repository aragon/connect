import { IpfsResolver } from '../types'
import { ErrorConnection, ErrorUnexpectedResult } from '../errors'
import { createCacheStore } from './cache-store'

export function ipfsResolver(
  urlTemplate: string,
  cache: number = 0
): IpfsResolver {
  const cacheStore = cache === 0 ? null : createCacheStore<object>(cache)

  return {
    async json(cid: string, path?): Promise<object> {
      const url = await this.url(cid, path)

      const fetchJson = async () => {
        let response
        let data

        try {
          response = await fetch(url)
        } catch (_) {
          throw new ErrorConnection(`Couldn’t fetch ${url}.`)
        }

        try {
          data = await response.json()
        } catch (_) {
          throw new ErrorUnexpectedResult(
            `Couldn’t parse the result of ${url} as JSON.`
          )
        }

        return data
      }

      return cacheStore?.get(url, fetchJson) || fetchJson()
    },
    async url(cid: string, path?): Promise<string> {
      const url = urlTemplate.replace(/\{cid\}/, cid)
      if (!path) {
        return url.replace(/\{path\}/, '')
      }
      if (!path.startsWith('/')) {
        path = `/${path}`
      }
      return url.replace(/\{path\}/, path)
    },
  }
}
