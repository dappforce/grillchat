import { useGetMyCreatorsIds } from '@/components/creatorsStaking/hooks/useGetMyCreators'
import { getSubIdRequest } from '@/server/external'
import { useMyMainAddress } from '@/stores/my-account'
import { createQuery, poolQuery } from '@/subsocial-query'
import { useMemo } from 'react'
import { getCreatorsListData } from '../creatorsList/query'
import { RewardsData } from './types'

export const useGetBackerRewards = (account: string) => {
  const creatorsListData = getCreatorsListData()

  const { data: creatorsList } = creatorsListData || {}

  const creatorsSpaceIds = useMemo(
    () => creatorsList?.map((creator) => creator.spaceId) || [],
    [creatorsList?.length]
  )

  const myCreatorsIds = useGetMyCreatorsIds(creatorsSpaceIds)

  const backerRewards = getBackerRewardsQuery.useQuery({
    account: account,
    spaceIds: myCreatorsIds || creatorsSpaceIds,
  })

  return backerRewards

}

export async function getBackerRewardsRequest(
  account: string,
  spaceIds: string[]
) {
  return getSubIdRequest().get('/staking/creator/backer/rewards', {
    params: { account, spaceIds: spaceIds.join(',') },
  })
}

type Params = {
  account: string
  spaceIds: string[]
}

const getBackerRewards = poolQuery<Params, RewardsData>({
  multiCall: async (params) => {
    const resultPromise = params.map(async ({ account, spaceIds }) => {
      const result = await getBackerRewardsRequest(account, spaceIds)

      return { account, ...result.data }
    })

    const result = await Promise.all(resultPromise)
    return result
  },
  resultMapper: {
    paramToKey: (params) => params.account,
    resultToKey: (item) => item.account,
  },
})
export const getBackerRewardsQuery = createQuery({
  key: 'bakerRewards',
  fetcher: getBackerRewards,
})
