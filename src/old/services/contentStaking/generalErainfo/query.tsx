import { getSubIdRequest } from '@/old/services/external'
import { createQuery, poolQuery } from '@/old/subsocial-query'
import { GeneralEraInfo } from './types'

export const generalEraInfoId = 'generalEraInfoId'

export const getGeneralEraInfoData = () => {
  return getGeneralEraInfoQuery.useQuery(generalEraInfoId)
}

export async function getGeneralEraInfoRequest() {
  return getSubIdRequest().get('staking/creator/era/info')
}

const getGeneralEraInfo = poolQuery<string, GeneralEraInfo>({
  name: 'getGeneralEraInfo',
  multiCall: async () => {
    const result = await getGeneralEraInfoRequest()

    return [result.data]
  },
  resultMapper: {
    paramToKey: (id) => id,
    resultToKey: () => generalEraInfoId,
  },
})
export const getGeneralEraInfoQuery = createQuery({
  key: 'generalEraInfo',
  fetcher: getGeneralEraInfo,
})
