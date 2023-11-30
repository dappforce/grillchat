import { getDatahubConfig } from '@/utils/env/client'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { gql } from 'graphql-request'
import { useEffect, useRef } from 'react'
import {
  DataHubSubscriptionEventEnum,
  SubscribeBlockedResourcesSubscription,
} from '../generated-query'
import { datahubSubscription } from '../utils'
import {
  getBlockedInPostIdDetailedQuery,
  getBlockedResourcesQuery,
} from './query'
import { getBlockedResourceType, ResourceTypes } from './utils'

export function useDatahubModerationSubscriber() {
  const queryClient = useQueryClient()
  const unsubRef = useRef<(() => void) | undefined>()

  useEffect(() => {
    if (!getDatahubConfig()) return

    const listener = () => {
      if (document.visibilityState === 'visible') {
        unsubRef.current = subscription(queryClient)
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
      }
    }
  }
`

let isSubscribed = false
function subscription(queryClient: QueryClient) {
  if (isSubscribed) return
  isSubscribed = true

  const client = datahubSubscription()
  let unsub = client.subscribe<SubscribeBlockedResourcesSubscription, null>(
    {
      query: SUBSCRIBE_BLOCKED_RESOURCES,
    },
    {
      complete: () => undefined,
      next: async (data) => {
        const eventData = data.data?.moderationBlockedResource
        if (!eventData) return

        await processSubscriptionEvent(queryClient, eventData)
      },
      error: (err) => {
        console.log('error subscription', err)
      },
    }
  )

  return () => {
    unsub()
    isSubscribed = false
  }
}

async function processSubscriptionEvent(
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
    // TODO: update detailed query also
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
