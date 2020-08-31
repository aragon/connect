import React, { useState } from 'react'
import {
  Connect,
  createAppHook,
  useApp,
  useOrganization,
} from '@aragon/connect-react'
import connectVoting, { Voting, Vote } from '@aragon/connect-voting'

// const NETWORK = 1
// const ORG_ADDRESS = 'governance.aragonproject.eth'
// const VOTING_APP_FILTER = 'voting'
const NETWORK = 4
const ORG_ADDRESS = '0x7cee20f778a53403d4fc8596e88deb694bc91c98'
const VOTING_APP_FILTER = '0xf7f9a33ed13b01324884bd87137609251b5f7c88'

const VOTES_PER_PAGE = 5

const useVoting = createAppHook(connectVoting)

export default function App() {
  const [showActions, setShowActions] = useState(false)
  const [mountOrg, setMountOrg] = useState(true)
  const [mountApp, setMountApp] = useState(true)
  const [mountVotes, setMountVotes] = useState(true)
  return (
    <Connect
      location={ORG_ADDRESS}
      connector="thegraph"
      options={{ network: NETWORK }}
    >
      <main>
        <button
          className="actions-button"
          onClick={() => setShowActions(!showActions)}
        >
          {showActions ? '✖️' : '🔨'}
        </button>
        {showActions && (
          <div className="actions">
            <button onClick={() => setMountOrg(!mountOrg)}>
              {mountOrg ? 'unmount' : 'mount'} org
            </button>
            <button onClick={() => setMountApp(!mountApp)}>
              {mountApp ? 'unmount' : 'mount'} app
            </button>
            <button onClick={() => setMountVotes(!mountVotes)}>
              {mountVotes ? 'unmount' : 'mount'} votes
            </button>
          </div>
        )}
        {mountOrg && <Organization />}
        {mountApp && <VotingApp />}
        {mountVotes && <Votes />}
      </main>
    </Connect>
  )
}

function Organization() {
  const [org] = useOrganization()
  return (
    <section>
      <h1>Organization</h1> <p>{org?.address || 'Loading…'}</p>
    </section>
  )
}

const VotingApp = React.memo(function VotingApp() {
  const [voting, { error, loading }] = useApp(VOTING_APP_FILTER)
  return (
    <section>
      <h1>Voting App</h1>
      <p>
        {(() => {
          if (loading) {
            return 'Loading…'
          }
          if (error) {
            return error.message
          }
          if (!voting) {
            return 'App not found.'
          }
          return voting?.address
        })()}
      </p>
    </section>
  )
})

function Votes() {
  const [page, setPage] = useState<number>(0)

  const [voting, votingStatus] = useApp(VOTING_APP_FILTER)

  const [votes = [], votesStatus] = useVoting<Vote[]>(
    voting,
    (app: Voting) => {
      return app.onVotes({
        first: VOTES_PER_PAGE,
        skip: VOTES_PER_PAGE * page,
      })
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
          if (votingStatus.error) {
            return <p>{votingStatus.error.message}</p>
          }
          if (votesStatus.error) {
            return <p>{votesStatus.error.message}</p>
          }
          if (votingStatus.loading || votesStatus.loading) {
            return <p>Loading…</p>
          }
          if (votes && votes.length > 0) {
            return (
              <ul>
                {votes?.map((vote: Vote) => (
                  <li key={vote.id}>{formatVote(vote)}</li>
                ))}
              </ul>
            )
          }
          return <p>No votes.</p>
        })()}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginTop: '30px',
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
  return str || '(action)'
}
