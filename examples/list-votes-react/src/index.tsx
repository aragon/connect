/** @jsx jsx */
import React from 'react'
import ReactDOM from 'react-dom'
import { jsx } from '@emotion/core'
import App from './App'

const STRICT_MODE = false

ReactDOM.render(
  STRICT_MODE ? (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  ) : (
    <App />
  ),
  document.getElementById('root')
)

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept()
}
