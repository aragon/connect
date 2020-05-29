/** @jsx jsx */
import { Global, css, jsx } from '@emotion/core'

type MainProps = { children: React.ReactNode }

export default function Main({ children }: MainProps) {
  return (
    <div>
      <div
        css={css`
          max-width: 800px;
          margin: 0 auto;
          padding: 60px 0;
        `}
      >
        <h1
          css={css`
            font-size: 40px;
            margin: 0;
            padding: 0 0 60px;
          `}
        >
          Org Viewer
        </h1>
        <div>{children}</div>
      </div>
      <Global
        styles={css`
          @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400&display=swap');
          *,
          *:before,
          *:after {
            box-sizing: border-box;
          }
          body {
            margin: 0;
            background: #faf1fa;
          }
          body,
          h1,
          input,
          button {
            font: 300 24px/1.5 'Fira Code';
            color: #222;
          }
          input[type='text'] {
            background: #fff;
            &::placeholder {
              color: #222;
            }
          }
        `}
      />
    </div>
  )
}
