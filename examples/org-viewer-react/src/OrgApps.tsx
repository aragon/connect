/** @jsx jsx */
import { jsx } from '@emotion/core'
import { useApps } from '@aragon/connect-react'
import Group from './Group'
import Table from './Table'
import TextButton from './TextButton'

type Props = {
  onOpenApp: (address: string) => void
}

export default function OrgApps({ onOpenApp }: Props) {
  const [apps, { loading }] = useApps()

  return (
    <Group name="Apps" loading={loading}>
      <Table
        headers={['Name', 'Version', 'Address']}
        rows={[...apps]
          .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
          .map(app => [
            app.name || 'unknown',
            app.version || '?',
            <TextButton onClick={() => onOpenApp(app.address)}>
              {app.address.slice(0, 6)}
            </TextButton>,
          ])}
      />
    </Group>
  )
}
