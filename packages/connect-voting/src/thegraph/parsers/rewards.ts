import { ErrorUnexpectedResult } from 'packages/connect-core/dist/cjs'
import { QueryResult } from 'packages/connect-thegraph/dist/cjs'
import Reward from '../../models/Reward'
import { RewardData } from '../../types'

export function parseRewards(result: QueryResult): Reward[] {
  const rewards = result.data.rewards

  if (!rewards) {
    throw new ErrorUnexpectedResult('Unable to parse rewards.')
  }

  const datas = rewards.map(
    (reward: any): RewardData => {
      return {
        id: reward.id,
        vote: reward.vote.id,
        token: reward.token,
        to: reward.to,
        amount: reward.amount,
      }
    }
  )

  return datas.map((data: RewardData) => {
    return new Reward(data)
  })
}
