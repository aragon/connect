/** @jsx jsx */
import { jsx } from '@emotion/core'
import { Application, Organization } from '@aragon/connect'
import Group from './Group'
import Table from './Table'
import TextButton from './TextButton'
import { useCancellableAsync } from './generic-hooks'

type Props = {
  org?: Organization
  onOpenApp: (address: string) => void
}

export default function OrgApps({ onOpenApp, org }: Props) {
  const [apps = [], loading] = useCancellableAsync<Application[]>(
    async () => (org ? org.apps() : []),
    [org]
  )

  return (
    <Group name="Apps" loading={loading}>
      <Table
        headers={['Name', 'Version', 'Address']}
        rows={[...apps]
          .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
          .map((app: Application) => [
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
