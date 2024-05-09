import { ApiPostsResponse } from '@/pages/api/posts'
import { apiInstance } from './utils'

export async function getPosts(postIds: string[]) {
  const requestedIds = postIds.filter((id) => !!id)
  if (requestedIds.length === 0) return []
  const res = await apiInstance.get(
    '/api/posts?' + requestedIds.map((n) => `postIds=${n}`).join('&')
  )
  return (res.data as ApiPostsResponse).data ?? []
}
