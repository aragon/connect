import { utils as ethersUtils } from 'ethers'

import { CallScriptAction } from '../types'

export const CALLSCRIPT_ID = '0x00000001'

interface Segment {
  segment: CallScriptAction
  scriptLeft: string
}

function decodeSegment(script: string): Segment {
  // Get address
  const to = `0x${script.substring(0, 40)}`
  script = script.substring(40)

  // Get data
  const dataLength = parseInt(`0x${script.substring(0, 8)}`, 16) * 2
  script = script.substring(8)
  const data = `0x${script.substring(0, dataLength)}`

  // Return rest of script for processing
  script = script.substring(dataLength)

  return {
    segment: {
      to,
      data,
    },
    scriptLeft: script,
  }
}

/**
 * Checks whether a EVMScript bytes string is a call script.
 */
export function isCallScript(script: string): boolean {
  // Get script identifier (0x prefix + bytes4)
  const scriptId = script.substring(0, 10)
  return scriptId === CALLSCRIPT_ID
}

/**
 * Decode a call script bytes string into its actions.
 *
 * Will return an array containing objects with:
 *
 *  - `to`: to address
 *  - `data`: call data
 *
 */
export function decodeCallScript(script: string): CallScriptAction[] {
  if (!isCallScript(script)) {
    throw new Error(`Not a call script: ${script}`)
  }

  let scriptData = script.substring(10)
  const segments = []

  while (scriptData.length > 0) {
    const { segment, scriptLeft } = decodeSegment(scriptData)
    segments.push(segment)
    scriptData = scriptLeft
  }
  return segments
}

/**
 * Encode a call script
 *
 * Example:
 *
 * input:
 * [
 *  { to: 0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa, data: 0x11111111 },
 *  { to: 0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb, data: 0x2222222222 }
 * ]
 *
 * output:
 * 0x00000001
 *   aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0000000411111111
 *   bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb000000052222222222
 *
 *
 * @param {Array<CallScriptAction>} actions
 * @returns {string}
 */
export function encodeCallScript(actions: CallScriptAction[]): string {
  return actions.reduce((script: string, { to, data }) => {
    const address = ethersUtils.defaultAbiCoder.encode(['address'], [to])
    const dataLength = ethersUtils.defaultAbiCoder.encode(
      ['uint256'],
      [(data.length - 2) / 2]
    )

    return script + address.slice(26) + dataLength.slice(58) + data.slice(2)
  }, CALLSCRIPT_ID)
}
