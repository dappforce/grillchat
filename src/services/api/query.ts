import { ApiDatahubGetResponse, DatahubQueryInput } from '@/pages/api/datahub'
import { Identities } from '@/pages/api/identities'
import { ApiNftParams, ApiNftResponse } from '@/pages/api/nft'
import { createQuery, poolQuery } from '@/subsocial-query'
import { PostData } from '@subsocial/api/types'
import axios from 'axios'
import { useMemo } from 'react'
import { SubsocialProfile } from '../subsocial/profiles/fetcher'
import { getIdentities, getPosts, getProfiles } from './fetcher'

const getPost = poolQuery<string, PostData>({
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

  const res = await axios.get('/api/nft?' + urlQuery.toString())
  const responseData = res.data as ApiNftResponse
  return responseData.data
}
export const getNftQuery = createQuery({
  key: 'nft',
  fetcher: getNft,
})

const getProfile = poolQuery<string, SubsocialProfile>({
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
})

const getIdentity = poolQuery<string, Identities>({
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
})

async function getCanUserDoDatahubAction(input: DatahubQueryInput) {
  const urlParams = new URLSearchParams(input)
  const res = await axios.get('/api/datahub?' + urlParams.toString())
  return (res.data as ApiDatahubGetResponse).isAllowed
}
export const getCanUserDoDatahubActionQuery = createQuery({
  key: 'datahub-can-do',
  fetcher: getCanUserDoDatahubAction,
})
