import { env } from '@/env.mjs'
import {
  getBlockedResources,
  getBlockedResourcesQuery,
} from '@/old/services/datahub/moderation/query'
import { QueryClient } from '@tanstack/react-query'

export async function prefetchBlockedEntities(
  queryClient: QueryClient,
  spaceIds: string[],
  postIds: string[]
) {
  try {
    const { blockedInPostIds, blockedInSpaceIds, blockedInAppIds } =
      await getBlockedResources({
        spaceIds,
        postEntityIds: postIds,
        appIds: [env.NEXT_PUBLIC_APP_ID],
      })
    blockedInSpaceIds.forEach((data) => {
      getBlockedResourcesQuery.setQueryData(
        queryClient,
        { spaceId: data.id },
        { ...data, type: 'spaceId' }
      )
      getBlockedResourcesQuery.invalidate(queryClient, { spaceId: data.id })
    })
    blockedInPostIds.forEach((data) => {
      getBlockedResourcesQuery.setQueryData(
        queryClient,
        { postEntityId: data.id },
        { ...data, type: 'postEntityId' }
      )
      getBlockedResourcesQuery.invalidate(queryClient, {
        postEntityId: data.id,
      })
    })
    blockedInAppIds.forEach((data) => {
      getBlockedResourcesQuery.setQueryData(
        queryClient,
        { appId: data.id },
        { ...data, type: 'appId' }
      )
      getBlockedResourcesQuery.invalidate(queryClient, { appId: data.id })
    })

    return { blockedInSpaceIds, blockedInPostIds, blockedInAppIds }
  } catch (err) {
    console.error('Error prefetching blocked entities', err)
  }
}
