/** @jsx jsx */
import { css, jsx } from '@emotion/core'

export default function TextButton({ ...props }) {
  return (
    <button
      css={css`
        outline: 0;
        border: 0;
        background: none;
        padding: 0;
        color: #df33a4;
        cursor: pointer;
        &:active {
          transform: translateY(0.5px);
        }
      `}
      {...props}
    />
  )
}
