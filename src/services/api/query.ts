import { createQuery, poolQuery } from '@/subsocial-query'
import { getBaseUrl } from '@/utils/env/client'
import { PostData } from '@subsocial/api/types'
import axios from 'axios'
import urlJoin from 'url-join'

export async function getPosts(postIds: string[]) {
  const res = await axios.get(
    urlJoin(getBaseUrl(), '/api/posts?') +
      postIds.map((n) => `postIds=${n}`).join('&')
  )
  return res.data.data as PostData[]
}
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
  key: 'getPost',
  getData: getPost,
})
