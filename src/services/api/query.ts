import { createQuery, poolQuery } from '@/subsocial-query'
import { PostData } from '@subsocial/api/types'
import axios from 'axios'

export async function getPosts(postIds: string[]) {
  const requestedIds = postIds.filter((id) => !!id)
  if (requestedIds.length === 0) return []
  const res = await axios.get(
    '/api/posts?' + requestedIds.map((n) => `postIds=${n}`).join('&')
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
  fetcher: getPost,
})
