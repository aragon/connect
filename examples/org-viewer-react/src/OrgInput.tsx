/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { Fragment, useCallback } from 'react'
import TextButton from './TextButton'
import { env } from './environment'

type OrgInputProps = {
  orgName: string
  onChange: (orgName: string) => void
}

export default function OrgInput({ orgName, onChange }: OrgInputProps) {
  const onInputChange = useCallback((event) => {
    onChange(event.target.value)
  }, [])

  return (
    <Fragment>
      <label>
        <div
          css={css`
            padding-left: 4px;
            padding-bottom: 8px;
            font-size: 20px;
          `}
        >
          Enter an organization’s location:
        </div>
        <input
          onChange={onInputChange}
          placeholder="e.g. xyz.aragonid.eth"
          type="text"
          value={orgName}
          css={css`
            width: 100%;
            padding: 12px;
            border: 2px solid #fad4fa;
            border-radius: 6px;
            font-size: 24px;
            outline: 0;
          `}
        />
      </label>
      <div
        css={css`
          white-space: nowrap;
          padding-top: 8px;
          padding-left: 4px;
          font-size: 20px;
        `}
      >
        Or pick one:&nbsp;
        {env.addresses.map((name, index) => (
          <span key={name}>
            {index > 0 && <span>, </span>}
            <TextButton onClick={() => onChange(name)}>
              {name.match(/^[^\.]+/)?.[0]}
            </TextButton>
          </span>
        ))}
        .
      </div>
    </Fragment>
  )
}
