import { getSubIdRequest } from '@/server/external'
import { createQuery, poolQuery } from '@/subsocial-query'
import { getGeneralEraInfoData } from '../generalErainfo/query'
import { EraStake } from './types'

export async function getEraStakeRequest(era: string, spaceIds: string[]) {
  return getSubIdRequest().get('staking/creator/era/stake', {
    params: { era, ids: spaceIds.join(',') },
  })
}

const getBackerRewards = poolQuery<string, EraStake>({
  multiCall: async (spaceIds) => {
    const { data } = getGeneralEraInfoData()

    const { currentEra } = data || {}

    const eraStake: Record<string, any> = await getEraStakeRequest(
      currentEra || '0',
      spaceIds
    )

    const resultPromise = spaceIds.map(async (spaceId) => {
      const item = eraStake[spaceId]

      const id = `${spaceId}-${currentEra || '0'}`

      if (!item)
        return {
          id: spaceId,
          totalStaked: '0',
          numberOfStakers: '0',
          creatorRewardClaimed: false,
        }

      return {
        id: spaceId,
        ...item,
      }
    })

    const result = await Promise.all(resultPromise)
    return result
  },
  resultMapper: {
    paramToKey: (id) => id,
    resultToKey: (item) => item.id,
  },
})
export const getBackerRewardsQuery = createQuery({
  key: 'bakerRewards',
  fetcher: getBackerRewards,
})
