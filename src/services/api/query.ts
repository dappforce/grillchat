import { ApiNftParams, ApiNftResponse } from '@/pages/api/nft'
import { createQuery, poolQuery } from '@/subsocial-query'
import { PostData } from '@subsocial/api/types'
import axios from 'axios'
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
function augmentQueryData(
  queryData: ReturnType<(typeof rawGetPostQuery)['useQuery']>,
  config?: AdditionalConfig
) {
  const { showHiddenPost = { type: 'none' } } = config || {}

  const hideHiddenPost = () => {
    if (queryData.data?.struct.hidden) queryData.data = null
  }

  switch (showHiddenPost.type) {
    case 'all':
      hideHiddenPost()
      break
    case 'owner':
      if (queryData.data?.struct.ownerId === showHiddenPost.owner)
        hideHiddenPost()
      break
  }
  return queryData
}

export const getPostQuery = {
  ...rawGetPostQuery,
  useQuery: (postId: string, config?: Config) => {
    const queryData = rawGetPostQuery.useQuery(postId, config)
    augmentQueryData(queryData, config)
    return queryData
  },
  useQueries: (postIds: string[], config?: Config) => {
    const queriesData = rawGetPostQuery.useQueries(postIds, config)
    if (!config?.showHiddenPost) {
      queriesData.forEach((queryData) => {
        augmentQueryData(queryData, config)
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
