import { getPostQuery } from '@/services/api/query'
import { useCommentIdsByPostIds } from '@/services/subsocial/commentIds'
import { CommentData } from '@subsocial/api/types'
import { useMemo } from 'react'

export default function useSortedPostIdsByLatestMessage(
  postIds: string[] = []
) {
  const commentIdsQueries = useCommentIdsByPostIds(postIds, {
    subscribe: true,
  })
  const latestPostIds = useMemo(() => {
    return commentIdsQueries?.map((query) => {
      const ids = query.data
      return ids?.[ids?.length - 1] ?? null
    })
  }, [commentIdsQueries])
  const lastPostsQueries = getPostQuery.useQueries(latestPostIds ?? [])
  return useMemo(() => {
    const posts = lastPostsQueries?.map((q) => q.data)
    posts.sort(
      (a, b) => (b?.struct.createdAtTime ?? 0) - (a?.struct.createdAtTime ?? 0)
    )
    const hasAddedIds = new Set()
    const sortedIds: string[] = []
    posts.forEach((post) => {
      const id = (post as unknown as CommentData)?.struct.rootPostId
      if (!id) return
      hasAddedIds.add(id)
      sortedIds.push(id)
    })
    const restIds = postIds.filter((id) => !hasAddedIds.has(id))
    return [...sortedIds, ...restIds]
  }, [lastPostsQueries, postIds])
}
