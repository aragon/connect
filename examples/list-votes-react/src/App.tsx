import React from 'react'
import {
  Connect,
  createAppHook,
  useApp,
  useOrganization,
} from '@aragon/connect-react'
import connectVoting, { Voting, Vote } from '@aragon/connect-voting'

const useVoting = createAppHook(connectVoting)

export default function App() {
  return (
    <Connect location="governance.aragonproject.eth" connector="thegraph">
      <Organization />
      <Votes />
    </Connect>
  )
}

function Organization() {
  const [org] = useOrganization()
  return (
    <section>
      <h1>Organization</h1> <p>{org?.address || 'loading…'}</p>
    </section>
  )
}

function Votes() {
  const [voting] = useApp('voting')
  const [votes] = useVoting(voting, (app: Voting) => app.votes())
  return (
    <section>
      <h1>Votes</h1>
      <ul>
        {votes?.map((vote: Vote) => (
          <li key={vote.id}>{formatVote(vote)}</li>
        )) || <li>Loading votes…</li>}
      </ul>
    </section>
  )
}

function formatVote(vote: any): string {
  let str = vote.metadata
  str = str.replace(/\n/g, ' ')
  str = str.length > 60 ? str.slice(0, 60) + '…' : str
  return str || '[Action]'
}
