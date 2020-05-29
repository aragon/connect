/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import Group from './Group'

type TableProps = {
  headers: React.ReactNode[]
  rows: React.ReactNode[][]
}

export default function Table({ headers, rows }: TableProps) {
  return (
    <table
      css={css`
        width: 100%;
        border-collapse: collapse;
        td,
        th {
          padding: 12px 24px;
          text-align: left;
          font-weight: 300;
          width: calc(100% / ${headers.length});
          white-space: nowrap;
        }
        td {
          border-top: 2px solid #fad4fa;
        }
        th:last-child,
        td:last-child {
          text-align: right;
        }
      `}
    >
      <thead>
        <tr>
          {headers.map((header: React.ReactNode, index: number) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((cells: React.ReactNode[], index: number) => (
          <tr key={index}>
            {cells.map((cell: React.ReactNode, index: number) => (
              <td key={index}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
