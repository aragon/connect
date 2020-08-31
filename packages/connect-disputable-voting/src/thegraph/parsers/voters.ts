import { QueryResult } from '@aragon/connect-thegraph'

import Voter from '../../models/Voter'

export function parseVoter(result: QueryResult, connector: any): Voter {
  const voter = result.data.voter

  if (!voter) {
    throw new Error('Unable to parse voter.')
  }

  return new Voter(
    {
      id: voter.id,
      address: voter.address,
      representative: voter.representative,
      votingId: voter.voting.id,
    },
    connector
  )
}
