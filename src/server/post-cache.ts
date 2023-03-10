import { getSubsocialApi } from '@/subsocial-query/subsocial'
import { MinimalUseQueue } from '@/utils/data-structure'
import { PostData } from '@subsocial/api/types'

const MAX_POST_CACHE_SIZE = 500
const postCache = new MinimalUseQueue<PostData>(MAX_POST_CACHE_SIZE)

export async function getCachedPosts(ids: string[]): Promise<PostData[]> {
  const postsFromCache: PostData[] = []
  const needToFetchIds: string[] = []
  ids.forEach(async (id) => {
    const post = postCache.get(id)
    if (post) postsFromCache.push(post)
    else needToFetchIds.push(id)
  })
  const subsocialApi = await getSubsocialApi()
  const postsFromApi = await subsocialApi.findPublicPosts(needToFetchIds)
  postsFromApi.forEach((post) => {
    postCache.add(post.id, JSON.parse(JSON.stringify(post)))
  })
  return [...postsFromApi, ...postsFromCache]
}
