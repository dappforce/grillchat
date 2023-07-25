import {
  getBlockedInPostIdQuery,
  getBlockedInSpaceIdQuery,
} from '@/services/api/moderation/query'
import { QueryClient } from '@tanstack/react-query'
import { getBlockedInPostIds, getBlockedInSpaceIds } from '.'

export async function prefetchBlockedEntities(
  queryClient: QueryClient,
  spaceIds: string[],
  postIds: string[]
) {
  try {
    const [blockedInSpaceIds, blockedInPostIds] = await Promise.all([
      getBlockedInSpaceIds(spaceIds),
      getBlockedInPostIds(postIds),
    ] as const)
    blockedInSpaceIds.forEach((data) => {
      getBlockedInSpaceIdQuery.setQueryData(queryClient, data.spaceId, data)
    })
    blockedInPostIds.forEach((data) => {
      getBlockedInPostIdQuery.setQueryData(queryClient, data.postId, data)
    })

    return { blockedInSpaceIds, blockedInPostIds }
  } catch (err) {
    console.log('Error prefetching blocked entities', err)
  }
}
