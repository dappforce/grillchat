import { ApiMetadataResponse } from '@/pages/api/metadata'
import { ApiNftParams, ApiNftResponse } from '@/pages/api/nft'
import { createQuery, poolQuery } from '@/subsocial-query'
import { PostData } from '@subsocial/api/types'
import axios from 'axios'
import { useMemo } from 'react'
import { getPosts } from './fetcher'

const getPost = poolQuery<string, PostData>({
  multiCall: async (postIds) => {
    if (postIds.length === 0) return []
    return getPosts(postIds)
  },
  resultMapper: {
    paramToKey: (postId) => postId,
    resultToKey: (result) => result?.id ?? '',
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

export type GetMetadataData = ApiMetadataResponse['data']
async function getMetadata(url: string) {
  const res = await axios.get('/api/metadata', {
    params: { url },
  })
  const responseData = res.data as ApiMetadataResponse
  return responseData.data
}
export const getMetadataQuery = createQuery({
  key: 'metadata',
  fetcher: getMetadata,
})
