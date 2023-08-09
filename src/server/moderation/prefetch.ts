import { getBlockedResourcesQuery } from '@/services/api/moderation/query'
import { QueryClient } from '@tanstack/react-query'
import { getBlockedResources } from '.'

export async function prefetchBlockedEntities(
  queryClient: QueryClient,
  spaceIds: string[],
  postIds: string[]
) {
  try {
    const { blockedInPostIds, blockedInSpaceIds } = await getBlockedResources({
      spaceIds,
      postIds,
    })
    blockedInSpaceIds.forEach((data) => {
      getBlockedResourcesQuery.setQueryData(
        queryClient,
        { spaceId: data.id },
        { ...data, type: 'spaceId' }
      )
    })
    blockedInPostIds.forEach((data) => {
      getBlockedResourcesQuery.setQueryData(
        queryClient,
        { postId: data.id },
        { ...data, type: 'postId' }
      )
    })

    return { blockedInSpaceIds, blockedInPostIds }
  } catch (err) {
    console.log('Error prefetching blocked entities', err)
  }
}
