import React, { useEffect, useRef, useState } from 'react'
import {
  App as ConnectApp,
  Connect,
  createAppHook,
  useApp,
  useApps,
  useOrganization,
} from '@aragon/connect-react'
import connectVoting, { Voting, Vote } from '@aragon/connect-voting'

const VOTES_PER_PAGE = 5

const useVoting = createAppHook(connectVoting)

export default function App() {
  return (
    <Connect location="governance.aragonproject.eth" connector="thegraph">
      <Organization />
      <VotingApp />
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

function VotingApp() {
  const [voting] = useApp('voting')
  return (
    <section>
      <h1>Voting App</h1> <p>{voting?.address || 'loading…'}</p>
    </section>
  )
}

function Votes() {
  const [voting, votingStatus] = useApp('voting')
  const [page, setPage] = useState<number>(0)

  const [votes, votesStatus] = useVoting(
    voting,
    (app: Voting) => {
      return app.votes({ first: VOTES_PER_PAGE, skip: VOTES_PER_PAGE * page })
    },
    [page]
  )

  return (
    <section>
      <h1>Votes</h1>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: `${VOTES_PER_PAGE * 24}px`,
        }}
      >
        {(() => {
          if (votingStatus.loading || votesStatus.loading) {
            return <p>Loading votes…</p>
          }
          if (votesStatus.error) {
            return <p>Error: {votesStatus.error.message}</p>
          }
          if (votes) {
            return (
              <ul>
                {votes.map((vote: Vote) => (
                  <li key={vote.id}>{formatVote(vote)}</li>
                ))}
              </ul>
            )
          }
          return <p>No result.</p>
        })()}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginTop: '20px',
        }}
      >
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          Prev
        </button>
        <span>Page {page + 1}</span>
        <button onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </section>
  )
}

function formatVote(vote: any): string {
  let str = vote.metadata
  str = str.replace(/\n/g, ' ')
  str = str.length > 40 ? str.slice(0, 40) + '…' : str
  return str || '[Action]'
}
