import {
  getBlockedResources,
  getBlockedResourcesQuery,
} from '@/services/datahub/moderation/query'
import { QueryClient } from '@tanstack/react-query'

export async function prefetchBlockedEntities(
  queryClient: QueryClient,
  spaceIds: string[],
  postIds: string[]
) {
  try {
    const { blockedInPostIds, blockedInSpaceIds } = await getBlockedResources({
      spaceIds,
      postEntityIds: postIds,
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
        { postEntityId: data.id },
        { ...data, type: 'postEntityId' }
      )
    })

    return { blockedInSpaceIds, blockedInPostIds }
  } catch (err) {
    console.log('Error prefetching blocked entities', err)
  }
}
