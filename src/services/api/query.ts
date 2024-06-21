import {
  ApiDatahubPostGetResponse,
  DatahubPostQueryInput,
} from '@/pages/api/datahub/post'
import { ApiDayResponse } from '@/pages/api/day'
import { ApiNftParams, ApiNftResponse } from '@/pages/api/nft'
import { ApiStakedParams, ApiStakedResponse } from '@/pages/api/staked'
import { ApiTimeResponse } from '@/pages/api/time'
import { createQuery, poolQuery } from '@/subsocial-query'
import { PostData } from '@subsocial/api/types'
import { useMemo } from 'react'
import { getPosts } from './fetcher'
import { apiInstance } from './utils'

const getPost = poolQuery<string, PostData>({
  name: 'getPost',
  multiCall: async (postIds) => {
    if (postIds.length === 0) return []
    return getPosts(postIds)
  },
  resultMapper: {
    paramToKey: (postId) => postId,
    resultToKey: (result) => result.requestedId ?? result?.id ?? '',
  },
})
const rawGetPostQuery = createQuery({
  key: 'post',
  fetcher: getPost,
})

type ShowHiddenPostConfig =
  | { type: 'all' }
  | { type: 'none' }
  | { type: 'owner'; owner: string }
type AdditionalConfig = { showHiddenPost?: ShowHiddenPostConfig }
type Config = Parameters<(typeof rawGetPostQuery)['useQuery']>[1] &
  AdditionalConfig

type QueryData = ReturnType<(typeof rawGetPostQuery)['useQuery']>
const hiddenDataQueryRecord: Map<Object, QueryData> = new Map()
function modifyQueryData(queryData: QueryData, config?: AdditionalConfig) {
  const { showHiddenPost = { type: 'none' } } = config || {}

  const hideHiddenPost = () => {
    if (queryData.data?.struct.hidden) {
      const recordedData = hiddenDataQueryRecord.get(queryData)
      if (recordedData) {
        return recordedData
      }

      const hiddenDataQuery = {
        ...queryData,
        data: null,
      }
      hiddenDataQueryRecord.set(queryData, hiddenDataQuery)
      return hiddenDataQuery
    }

    return queryData
  }

  switch (showHiddenPost.type) {
    case 'none':
      return hideHiddenPost()
    case 'owner':
      if (queryData.data?.struct.ownerId !== showHiddenPost.owner)
        return hideHiddenPost()
      break
  }
  return queryData
}

export const getPostQuery = {
  ...rawGetPostQuery,
  useQuery: (postId: string, config?: Config) => {
    const queryData = rawGetPostQuery.useQuery(postId, config)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useMemo(() => modifyQueryData(queryData, config), [queryData])
  },
  useQueries: (postIds: string[], config?: Config) => {
    const queriesData = rawGetPostQuery.useQueries(postIds, config)
    if (config?.showHiddenPost?.type !== 'none') {
      return queriesData.map((queryData) => {
        return modifyQueryData(queryData, config)
      })
    }

    return queriesData
  },
}

async function getNft(nft: ApiNftParams | null) {
  if (!nft) return null
  const urlQuery = new URLSearchParams()
  urlQuery.set('chain', nft.chain)
  urlQuery.set('collectionId', nft.collectionId)
  urlQuery.set('nftId', nft.nftId)

  const res = await apiInstance.get('/api/nft?' + urlQuery.toString())
  const responseData = res.data as ApiNftResponse
  return responseData.data
}
export const getNftQuery = createQuery({
  key: 'nft',
  fetcher: getNft,
})

async function getCanUserDoDatahubAction(input: DatahubPostQueryInput) {
  const urlParams = new URLSearchParams(input)
  const res = await apiInstance.get('/api/datahub/post?' + urlParams.toString())
  return (res.data as ApiDatahubPostGetResponse).isAllowed
}
export const getCanUserDoDatahubActionQuery = createQuery({
  key: 'datahub-can-do',
  fetcher: getCanUserDoDatahubAction,
})

async function getHasUserStaked(input: ApiStakedParams) {
  const urlParams = new URLSearchParams(input)
  const res = await apiInstance.get('/api/staked?' + urlParams.toString())
  return (res.data as ApiStakedResponse).data
}
export const getHasUserStakedQuery = createQuery({
  key: 'has-user-staked',
  fetcher: getHasUserStaked,
  defaultConfigGenerator: (data) => ({
    enabled: !!data?.address,
  }),
})

export async function getServerTime() {
  try {
    const res = await apiInstance.get('/api/time')
    return (res.data as ApiTimeResponse).time
  } catch (err) {
    console.error('Failed to get server time', err)
    throw new Error('Failed to get server time')
  }
}

async function getServerDay() {
  try {
    const res = await apiInstance.get('/api/day')
    const data = res.data as ApiDayResponse
    return { day: data.day, week: data.week }
  } catch (err) {
    console.error('Failed to get server day', err)
    throw new Error('Failed to get server day')
  }
}
export const getServerDayQuery = createQuery({
  key: 'server-day',
  fetcher: getServerDay,
})
