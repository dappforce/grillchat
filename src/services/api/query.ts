import {
  ApiDatahubPostGetResponse,
  DatahubPostQueryInput,
} from '@/pages/api/datahub/post'
import { Identities } from '@/pages/api/identities'
import { ApiNftParams, ApiNftResponse } from '@/pages/api/nft'
import { ApiStakedParams, ApiStakedResponse } from '@/pages/api/staked'
import { ApiTimeResponse } from '@/pages/api/time'
import { createQuery, poolQuery } from '@/subsocial-query'
import { PostData } from '@subsocial/api/types'
import { useMemo } from 'react'
import { SubsocialProfile } from '../subsocial/profiles/fetcher'
import { getIdentities, getPosts, getProfiles } from './fetcher'
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

const getProfile = poolQuery<string, SubsocialProfile>({
  name: 'getProfile',
  multiCall: async (addresses) => {
    if (addresses.length === 0) return []
    return getProfiles(addresses)
  },
  resultMapper: {
    paramToKey: (address) => address,
    resultToKey: (result) => result?.address ?? '',
  },
})
export const getProfileQuery = createQuery({
  key: 'profile',
  fetcher: getProfile,
  defaultConfigGenerator: (data) => ({
    enabled: !!data,
  }),
})

const getIdentity = poolQuery<string, Identities>({
  name: 'getIdentity',
  multiCall: async (addresses) => {
    if (addresses.length === 0) return []
    return getIdentities(addresses)
  },
  resultMapper: {
    paramToKey: (address) => address,
    resultToKey: (result) => result?.address ?? '',
  },
})
export const getIdentityQuery = createQuery({
  key: 'identities',
  fetcher: getIdentity,
  defaultConfigGenerator: (data) => ({
    enabled: !!data,
  }),
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
  const res = await apiInstance.get('/api/time')
  return (res.data as ApiTimeResponse).time
}
