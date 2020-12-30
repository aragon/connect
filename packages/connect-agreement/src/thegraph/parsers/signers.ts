import { QueryResult } from '@aragon/connect-thegraph'

import Signer from '../../models/Signer'
import Signature from '../../models/Signature'

export function parseSigner(result: QueryResult, connector: any): Signer | null {
  const signer = result.data.signer

  if (!signer) {
    return null
  }

  return new Signer(
    {
      id: signer.id,
      address: signer.address,
      agreementId: signer.agreement.id,
    },
    connector
  )
}

export function parseSignatures(
  result: QueryResult,
  connector: any
): Signature[] {
  const signatures = result.data.signatures

  if (!signatures) {
    throw new Error('Unable to parse signatures.')
  }

  return signatures.map((data: any) => {
    return new Signature(
      {
        id: data.id,
        signerId: data.signer.id,
        versionId: data.version.id,
        createdAt: data.createdAt,
      },
      connector
    )
  })
}
