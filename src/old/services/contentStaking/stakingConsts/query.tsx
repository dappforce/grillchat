import { getSubIdRequest } from '@/old/services/external'
import { createQuery, poolQuery } from '@/old/subsocial-query'
import { StakingConsts } from './types'

export const stakingConstsId = 'stakingConsts'

export const getStakingConstsData = () => {
  return getCreatorsListQuery.useQuery(stakingConstsId)
}

export async function getStakingConstsRequest() {
  return getSubIdRequest().get('/staking/creator/consts')
}

const getStakingConsts = poolQuery<string, StakingConsts>({
  name: 'getStakingConsts',
  multiCall: async () => {
    const result = await getStakingConstsRequest()

    return [result.data]
  },
  resultMapper: {
    paramToKey: (id) => id,
    resultToKey: () => stakingConstsId,
  },
})
export const getCreatorsListQuery = createQuery({
  key: 'stakingConsts',
  fetcher: getStakingConsts,
})
