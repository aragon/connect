import { IpfsResolver } from '../types'
import { ErrorConnection, ErrorUnexpectedResult } from '../errors'

export function ipfsResolver(urlTemplate: string): IpfsResolver {
  return {
    async json(cid: string, path?): Promise<object> {
      const url = await this.url(cid, path)
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
