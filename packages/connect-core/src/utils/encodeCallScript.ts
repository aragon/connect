import { ethers } from 'ethers'

const CALLSCRIPT_ID = '0x00000001'

interface CallScriptAction {
  to: string
  data: string
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
export function encodeCallScript(actions: CallScriptAction[]) {
  return actions.reduce((script: string, { to, data }) => {
    const address = ethers.utils.defaultAbiCoder.encode(['address'], [to])
    const dataLength = ethers.utils.defaultAbiCoder.encode(
      ['uint256'],
      [(data.length - 2) / 2]
    )

    return script + address.slice(26) + dataLength.slice(58) + data.slice(2)
  }, CALLSCRIPT_ID)
}
