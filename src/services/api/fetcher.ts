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
