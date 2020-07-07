import React from 'react'
import ReactDOM from 'react-dom'
import { UseWalletProvider } from 'use-wallet'
import App from './App'

ReactDOM.render(
  <>
    <style>
      {`
        body, button {
          font: 16px/1.5 monospace;
        }
        body {
          margin: 0;
          padding: 40px;
          color: #333;
          background: #E5FFFF;
        }
        button {
          display: block;
          width: auto;
          padding: 5px;
          color: #FFF;
          background: #A5AAAA;
          border: 0;
          border-radius: 3px;
          cursor: pointer;
          font-size: 14px;
        }
        h1 {
          display: flex;
          align-items: center;
          margin: 30px 0 10px;
          font-weight: 400;
          font-size: 22px;
        }
        h1 button {
          margin-left: 10px;
        }
        section h1 {
          font-size: 18px;
        }
      `}
    </style>

    <UseWalletProvider chainId={4}>
      <App />
    </UseWalletProvider>
  </>,
  document.body.appendChild(document.createElement('main'))
)
