/** @jsx jsx */
import { css, jsx, keyframes } from '@emotion/core'

type GroupProps = {
  children: React.ReactNode
  loading?: boolean
  name: string
}

// const blink = keyframes`50% { opacity: 0 }`
const blink = keyframes`50% { opacity: 1 }`

export default function Group({ children, loading, name }: GroupProps) {
  return (
    <div
      css={css`
        padding-top: 64px;
      `}
    >
      <div
        css={css`
          padding-bottom: 16px;
          font-size: 20px;
        `}
      >
        {name}:
        {loading && (
          <span
            css={css`
              animation-name: ${blink};
              animation-duration: 80ms;
              animation-timing-function: steps(1);
              animation-iteration-count: infinite;
              font-size: 16px;
            `}
          >
            &nbsp;loading…
          </span>
        )}
      </div>
      {!loading && (
        <div
          css={css`
            background: #fff;
            border: 2px solid #fad4fa;
            border-radius: 6px;
          `}
        >
          {children}
        </div>
      )}
    </div>
  )
}
