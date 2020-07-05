import { useEffect, useState } from 'react'

export default function useRouting() {
  const [orgName, setOrgName] = useState('')

  const openOrg = (orgName: string) => {
    window.location.hash = `/${orgName}`
  }

  const openApp = (appAddress: string) => {
    window.location.hash = `/${orgName}/${appAddress}`
  }

  useEffect(() => {
    const onChange = () => {
      const org = window.location.hash.match(/^#\/([^\/]+)/)?.[1]
      setOrgName(org || '')
    }

    onChange()
    window.addEventListener('hashchange', onChange)

    return () => {
      window.removeEventListener('hashchange', onChange)
    }
  }, [])

  return { orgName, openOrg, openApp }
}
