import * as queries from './queries'
import Vote, { VoteData } from './entities/Vote'
import Cast, { CastData } from './entities/Cast'
import { GraphQLWrapper } from '@aragon/connect-thegraph'
import { parseVotes, parseCasts } from './parsers'

export default class VotingConnectorTheGraph extends GraphQLWrapper {
  async votesForApp(appAddress: string): Promise<Vote[]> {
    const result = await this.performQuery(queries.ALL_VOTES, { appAddress })

    const datas = this.parseQueryResult(parseVotes, result)

    return datas.map((data: VoteData) => {
      return new Vote(data, this)
    })
  }

  async castsForVote(voteId: string): Promise<Cast[]> {
    const result = await this.performQuery(queries.CASTS_FOR_VOTE, { voteId })

    const datas = this.parseQueryResult(parseCasts, result)

    return datas.map((data: CastData) => {
      return new Cast(data, this)
    })
  }
}
