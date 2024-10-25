import { getSubIdRequest } from '@/old/services/external'
import { createQuery, poolQuery } from '@/old/subsocial-query'
import { BackerInfo } from './types'

export const getBackerInfoBySpaceIds = (
  address: string,
  spaceIds: string[]
) => {
  const { data: backerInfo } = getBackerInfoQuery.useQuery({
    account: address,
    spaceIds,
  })

  const { info } = backerInfo || {}

  const backerInfoBySpaces: any = {}

  if (info) {
    spaceIds.forEach((spaceId) => {
      backerInfoBySpaces[spaceId] = info[spaceId]
    })
  }

  return backerInfoBySpaces
}

export async function getBackerInfoRequest(
  account: string,
  spaceIds: string[]
) {
  return getSubIdRequest().get('staking/creator/backer/info', {
    params: { account, ids: spaceIds.join(',') },
  })
}

type Params = {
  account: string
  spaceIds: string[]
}

const getBackerInfo = poolQuery<
  Params,
  { account: string; info: Record<string, BackerInfo> }
>({
  name: 'getBackerInfo',
  multiCall: async (params) => {
    const resultPromise = params.map(async ({ account, spaceIds }) => {
      const result = await getBackerInfoRequest(account, spaceIds)

      const data = result.data

      const backerInfoRecord: Record<string, BackerInfo> = {}

      spaceIds.forEach((spaceId) => {
        const item = data[spaceId]

        backerInfoRecord[spaceId] = {
          totalStaked: item,
        }
      })

      return { account, info: backerInfoRecord }
    })

    const result = await Promise.all(resultPromise)
    return result
  },
  resultMapper: {
    paramToKey: (params) => params.account,
    resultToKey: (item) => item.account,
  },
})
export const getBackerInfoQuery = createQuery({
  key: 'bakerInfo',
  fetcher: getBackerInfo,
})
