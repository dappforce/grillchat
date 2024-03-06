import { getSubIdRequest } from '@/services/external'
import { createQuery, poolQuery } from '@/subsocial-query'
import { RegisteredCreator } from './types'

export const creatorsListId = 'creatorsListId'

export const getCreatorsListData = () => {
  return getCreatorsListQuery.useQuery(creatorsListId)
}

export async function getCreatorsListRequest() {
  return getSubIdRequest().get('staking/creator/list')
}

const getCreatorsList = poolQuery<string, RegisteredCreator[]>({
  multiCall: async () => {
    const result = await getCreatorsListRequest()

    return [result.data]
  },
  resultMapper: {
    paramToKey: (id) => id,
    resultToKey: () => creatorsListId,
  },
})
export const getCreatorsListQuery = createQuery({
  key: 'creatorsList',
  fetcher: getCreatorsList,
})
