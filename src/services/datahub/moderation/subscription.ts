import { getDatahubConfig } from '@/utils/env/client'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { gql } from 'graphql-request'
import { useEffect, useRef } from 'react'
import {
  DataHubSubscriptionEventEnum,
  GetBlockedInPostIdDetailedQuery,
  SubscribeBlockedResourcesSubscription,
  SubscribeModeratorSubscription,
} from '../generated-query'
import { datahubSubscription } from '../utils'
import {
  getBlockedInPostIdDetailedQuery,
  getBlockedResourcesQuery,
  getModeratorQuery,
} from './query'
import { getBlockedResourceType, ResourceTypes } from './utils'

export function useDatahubModerationSubscriber() {
  const queryClient = useQueryClient()
  const unsubRef = useRef<(() => void) | undefined>()

  useEffect(() => {
    if (!getDatahubConfig()) return

    const listener = () => {
      if (document.visibilityState === 'visible') {
        unsubRef.current = moderationSubscription(queryClient)
        getBlockedResourcesQuery.invalidate(queryClient)
        getBlockedInPostIdDetailedQuery.invalidate(queryClient)
      } else {
        unsubRef.current?.()
      }
    }
    listener()
    document.addEventListener('visibilitychange', listener)
    return () => {
      document.removeEventListener('visibilitychange', listener)
      unsubRef.current?.()
    }
  }, [queryClient])
}

const SUBSCRIBE_MODERATOR = gql`
  subscription SubscribeModerator {
    moderationModerator {
      event
      entity {
        substrateAccount {
          id
        }
        moderatorOrganizations {
          organization {
            ctxPostIds
          }
        }
      }
    }
  }
`
const SUBSCRIBE_BLOCKED_RESOURCES = gql`
  subscription SubscribeBlockedResources {
    moderationBlockedResource {
      event
      entity {
        id
        blocked
        resourceId
        ctxPostIds
        organization {
          ctxPostIds
        }
        reason {
          id
          reasonText
        }
      }
    }
  }
`

let isSubscribed = false
function moderationSubscription(queryClient: QueryClient) {
  if (isSubscribed) return
  isSubscribed = true

  const client = datahubSubscription()
  let unsubBlockedResources = client.subscribe<
    SubscribeBlockedResourcesSubscription,
    null
  >(
    {
      query: SUBSCRIBE_BLOCKED_RESOURCES,
    },
    {
      complete: () => undefined,
      next: async (data) => {
        const eventData = data.data?.moderationBlockedResource
        if (!eventData) return

        await processBlockedResourcesEvent(queryClient, eventData)
      },
      error: (err) => {
        console.log('error blocked resources subscription', err)
      },
    }
  )

  console.log('subscribing moderator')
  let unsubModerator = client.subscribe<SubscribeModeratorSubscription, null>(
    {
      query: SUBSCRIBE_MODERATOR,
    },
    {
      complete: () => undefined,
      next: async (data) => {
        const eventData = data.data?.moderationModerator
        if (!eventData) return
        console.log('SUB MODERATOR', eventData)

        await processModeratorEvent(queryClient, eventData)
      },
      error: (err) => {
        console.log('error moderator subscription', err)
      },
    }
  )

  return () => {
    unsubBlockedResources()
    unsubModerator()
    isSubscribed = false
  }
}

async function processModeratorEvent(
  queryClient: QueryClient,
  eventData: SubscribeModeratorSubscription['moderationModerator']
) {
  if (
    eventData.event ===
      DataHubSubscriptionEventEnum.ModerationModeratorCreated ||
    eventData.event ===
      DataHubSubscriptionEventEnum.ModerationModeratorStateUpdated
  ) {
    await processModerator(queryClient, eventData)
  }
}

async function processBlockedResourcesEvent(
  queryClient: QueryClient,
  eventData: SubscribeBlockedResourcesSubscription['moderationBlockedResource']
) {
  if (
    eventData.event ===
      DataHubSubscriptionEventEnum.ModerationBlockedResourceCreated ||
    eventData.event ===
      DataHubSubscriptionEventEnum.ModerationBlockedResourceStateUpdated
  ) {
    await processBlockedResources(queryClient, eventData)
  }
}

async function processModerator(
  queryClient: QueryClient,
  eventData: SubscribeModeratorSubscription['moderationModerator']
) {
  const entity = eventData.entity
  const substrateAccountId = entity.substrateAccount.id
  const newCtxPostIds = entity.moderatorOrganizations
    ?.map((org) => org.organization.ctxPostIds)
    .flat()
    .filter(Boolean)
  getModeratorQuery.setQueryData(queryClient, substrateAccountId, (oldData) => {
    return {
      address: substrateAccountId,
      exist: true,
      postIds: newCtxPostIds ?? [],
    }
  })
}

async function processBlockedResources(
  queryClient: QueryClient,
  eventData: SubscribeBlockedResourcesSubscription['moderationBlockedResource']
) {
  const entity = eventData.entity
  const isNowBlocked = entity.blocked
  const ctxPostIds = entity.organization.ctxPostIds
  const resourceId = entity.resourceId
  const resourceType = getBlockedResourceType(resourceId)

  if (!resourceType) return

  ctxPostIds?.forEach((id) => {
    getBlockedInPostIdDetailedQuery.setQueryData(queryClient, id, (oldData) => {
      const resources: Record<
        ResourceTypes,
        GetBlockedInPostIdDetailedQuery['moderationBlockedResourcesDetailed'][number][]
      > = oldData || { address: [], cid: [], postId: [] }

      const newResource = [...resources[resourceType]]
      if (isNowBlocked) {
        newResource.push({
          resourceId,
          reason: entity.reason,
        })
      } else {
        const resourceIndex = newResource.findIndex(
          (res) => res.resourceId === resourceId
        )
        if (resourceIndex !== -1) {
          newResource.splice(resourceIndex, 1)
        }
      }
      return {
        ...resources,
        [resourceType]: newResource,
      }
    })

    getBlockedResourcesQuery.setQueryData(
      queryClient,
      { postId: id },
      (oldData) => {
        const resources: Record<ResourceTypes, string[]> =
          oldData?.blockedResources || { address: [], cid: [], postId: [] }

        const newResource = [...resources[resourceType]]
        if (isNowBlocked) {
          newResource.push(resourceId)
        } else {
          newResource.splice(newResource.indexOf(resourceId), 1)
        }
        return {
          id,
          type: 'postId',
          blockedResources: {
            ...resources,
            [resourceType]: newResource,
          },
        }
      }
    )
  })
}
