import ReactDOM from 'react-dom'
import React, { useEffect, useRef, useState } from 'react'
import {
  Connect,
  createAppHook,
  useApp,
  useOrganization,
} from '@aragon/connect-react'
import connectVoting from '@aragon/connect-voting'
import connectTokens from '@aragon/connect-tokens'
import { useWallet, UseWalletProvider } from 'use-wallet'

const useVoting = createAppHook(connectVoting)

function voteId(vote) {
  const id = parseInt(vote.id.match(/voteId:(.+)$/)?.[1], 16)
  return String(id + 1)
}

function Vote({ vote }) {
  return (
    <span>
      Vote {voteId(vote)}:{' '}
      {vote.metadata ? `“${vote.metadata}”` : <em>(action)</em>}
    </span>
  )
}

function App() {
  const wallet = useWallet()
  const [org, orgStatus] = useOrganization()
  const [voting, votingStatus] = useApp('voting')
  const [tokens, tokensStatus] = useApp('token-manager')
  const [votes = [], votesStatus] = useVoting(voting, (app) => app.onVotes())

  const [showVotes, setShowVotes] = useState(false)
  const [
    {
      intent,
      status: intentStatus,
      description: intentDescription,
      receipts: intentReceipts,
    },
    setIntent,
  ] = useState({
    status: 'none',
    description: null,
    intent: null,
    receipts: null,
  })

  const cancelIntent = useRef(null)

  const initIntent = (cb) => {
    cancelIntent.current?.()
    cancelIntent.current = cb
    setIntent({
      status: 'loading',
      description: null,
      intent: null,
      receipts: null,
    })
  }

  const resetIntent = () => {
    cancelIntent.current?.()
    setIntent({
      status: 'none',
      description: null,
      intent: null,
      receipts: null,
    })
  }

  const signIntent = async () => {
    setIntent((intent) => ({ ...intent, status: 'signing' }))

    let receipts

    try {
      receipts = await intent.sign((tx) => {
        return wallet.ethereum.request({
          method: 'eth_sendTransaction',
          params: [tx],
        })
      })
    } catch (err) {
      alert('Error! Check the console for details.')
      console.error('Signing error:', err)
    }

    setIntent((intent) => ({
      ...intent,
      status: 'signed',
      receipts,
    }))
  }

  const createVote = async () => {
    let cancelled = false
    initIntent(() => (cancelled = true))

    const intent = await voting.intent(
      'newVote(bytes,string)',
      ['0x00000001', 'A vote'],
      { actAs: wallet.account }
    )

    const description = await intent.describe()

    if (!cancelled) {
      setIntent({ status: 'loaded', intent, description, receipts: null })
    }
  }

  const assignOneToken = async () => {
    let cancelled = false
    initIntent(() => (cancelled = true))

    const intent = await tokens.intent(
      'mint(address,uint256)',
      [wallet.account, '1'],
      { actAs: wallet.account }
    )

    const description = await intent.describe()

    if (!cancelled) {
      setIntent({ status: 'loaded', description, intent, receipts: null })
    }
  }

  if (wallet.status !== 'connected') {
    return <ConnectOverlay />
  }

  return (
    <main>
      <div className="group">
        <h1>Forwarding path demo</h1>

        <h2>Summary</h2>
        <table>
          <tbody>
            <tr>
              <th>Account</th>
              <td>{wallet.account}</td>
            </tr>
            <tr>
              <th>Organization</th>
              <td>{org.address}</td>
            </tr>
            <tr>
              <th>Tokens</th>
              <td>{tokens?.address || 'loading…'}</td>
            </tr>
            <tr>
              <th>Voting</th>
              <td>{voting?.address || 'loading…'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="group">
        <h2>Actions</h2>
        <p className="actions">
          <span>Tokens:</span>
          {tokens ? (
            <button onClick={assignOneToken} disabled={intentStatus !== 'none'}>
              <span>assign 1 token</span>
            </button>
          ) : (
            'loading…'
          )}
        </p>
      </div>

      <div className="group">
        <p className="actions">
          <span>Voting:</span>

          {voting ? (
            <>
              <button onClick={createVote} disabled={intentStatus !== 'none'}>
                <span>create vote</span>
              </button>
              <button
                onClick={() => setShowVotes((v) => !v)}
                className={showVotes ? 'checked' : ''}
              >
                <span>show votes</span>
              </button>
            </>
          ) : (
            'loading…'
          )}
        </p>
      </div>

      <section className="group" style={{ minHeight: '200px' }}>
        <h1>
          <span>Intent</span>
          {intentStatus !== 'none' && (
            <button onClick={resetIntent}>clear</button>
          )}
          {['loaded', 'signing'].includes(intentStatus) && (
            <button onClick={signIntent} disabled={intentStatus === 'signing'}>
              sign
            </button>
          )}
        </h1>

        {intentStatus === 'none' && (
          <p>Please use one of the actions to create an intent.</p>
        )}

        {intentStatus === 'loading' && <p>Creating intent…</p>}

        {intentStatus !== 'none' && (
          <>
            {intentStatus === 'signed' && (
              <>
                <h2>Transactions receipts</h2>
                <table>
                  <tbody>
                    {intentReceipts.map((receipt) => (
                      <tr key={receipt}>
                        <td>{receipt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {intent?.destination && (
              <>
                <h2>Destination</h2>
                <table>
                  <tbody>
                    <tr>
                      <td>Name:</td>
                      <td>{intent.destination.name}</td>
                    </tr>
                    <tr>
                      <td>Address:</td>
                      <td>{intent.destination.address}</td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}

            {intentDescription && (
              <>
                <h2>Steps</h2>
                <table>
                  <thead>
                    <tr>
                      <th>From</th>
                      <th>To</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {intentDescription.describedSteps.map(
                      (
                        { annotatedDescription, data, description, from, to },
                        index
                      ) => (
                        <tr key={index}>
                          <td title={from} style={{ whiteSpace: 'nowrap' }}>
                            {shortenAddress(from)}
                          </td>
                          <td title={to} style={{ whiteSpace: 'nowrap' }}>
                            {shortenAddress(to)}
                          </td>
                          <td>
                            {annotatedDescription.map(
                              ({ type, value }, index) => {
                                const prefix = index > 0 ? ' ' : ''
                                if (type === 'address') {
                                  return (
                                    <span key={index}>
                                      {prefix + shortenAddress(value)}
                                    </span>
                                  )
                                }
                                return (
                                  <span key={index}>
                                    {prefix + String(value)}
                                  </span>
                                )
                              }
                            )}
                            .
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </>
            )}

            {intent?.transactions && (
              <>
                <h2>Transactions</h2>
                <table>
                  <thead>
                    <tr>
                      <th>From</th>
                      <th>To</th>
                      <th>Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {intent.transactions.map(({ data, from, to }, index) => (
                      <tr key={index}>
                        <td title={from} style={{ whiteSpace: 'nowrap' }}>
                          {shortenAddress(from)}
                        </td>
                        <td title={to} style={{ whiteSpace: 'nowrap' }}>
                          {shortenAddress(to)}
                        </td>
                        <td>{data}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </>
        )}
      </section>

      {showVotes && (
        <section className="group">
          <h1>Votes</h1>

          {(!voting || votes.length === 0) && <p>loading…</p>}

          {votes.length > 0 && (
            <ul>
              {[...votes]
                .sort((a, b) => {
                  console.log(a)
                  return 0
                })
                .map((vote) => (
                  <li key={voteId(vote)}>
                    <Vote vote={vote} />
                  </li>
                ))}
            </ul>
          )}
        </section>
      )}
    </main>
  )
}

function ConnectOverlay() {
  const wallet = useWallet()
  const connect = () => wallet.connect('injected')
  const disconnect = () => wallet.reset()

  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        width: '100%',
        height: 'calc(100vh - 64px)',
      }}
    >
      {wallet.status === 'disconnected' ? (
        <button onClick={connect}>
          <span>connect wallet</span>
        </button>
      ) : (
        <button onClick={disconnect}>
          <span>cancel</span>
        </button>
      )}
    </div>
  )
}

export function shortenAddress(address, charsLength = 4) {
  const prefixLength = 2 // "0x"
  if (!address) {
    return ''
  }
  if (address.length < charsLength * 2 + prefixLength) {
    return address
  }
  return (
    address.slice(0, charsLength + prefixLength) +
    '…' +
    address.slice(-charsLength)
  )
}

ReactDOM.render(
  <UseWalletProvider chainId={4}>
    <Connect
      location="0x9653898664ba3F871bCF671B62910d98377dc1C2"
      connector="thegraph"
      options={{ network: 4 }}
    >
      <App />
    </Connect>
  </UseWalletProvider>,
  document.querySelector('#app')
)
