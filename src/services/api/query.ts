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
export const getPostQuery = createQuery({
  key: 'post',
  fetcher: getPost,
})

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
