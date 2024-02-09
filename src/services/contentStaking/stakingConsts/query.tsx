import { getSubIdRequest } from '@/server/external'
import { StakingConsts } from '@/services/chainsInfo/types'
import { createQuery, poolQuery } from '@/subsocial-query'

export const stakingConstsId = 'stakingConsts'

export const getStakingConstsData = () => {
  return getCreatorsListQuery.useQuery(stakingConstsId)
}

export async function getStakingConstsRequest() {
  return getSubIdRequest().get('/staking/consts')
}

const getStakingConsts = poolQuery<string, StakingConsts>({
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
