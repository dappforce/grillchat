import { useMyMainAddress } from '@/stores/my-account'
import { getDatahubConfig } from '@/utils/env/client'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { gql } from 'graphql-request'
import { useEffect, useRef } from 'react'
import {
  DataHubSubscriptionEventEnum,
  GetBlockedInPostIdDetailedQuery,
  SubscribeBlockedResourcesSubscription,
  SubscribeOrganizationSubscription,
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
  const myAddress = useMyMainAddress()

  useEffect(() => {
    if (!getDatahubConfig()) return

    const listener = () => {
      if (document.visibilityState === 'visible') {
        unsubRef.current = moderationSubscription(queryClient)

        getBlockedResourcesQuery.invalidate(queryClient)
        getBlockedInPostIdDetailedQuery.invalidate(queryClient)
        getModeratorQuery.invalidate(queryClient, myAddress)
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
  }, [queryClient, myAddress])
}

const SUBSCRIBE_ORGANIZATION = gql`
  subscription SubscribeOrganization {
    moderationOrganization {
      event
      entity {
        organizationModerators {
          moderator {
            substrateAccount {
              id
            }
          }
        }
        ctxPostIds
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
  let unsubModerator = client.subscribe<
    SubscribeOrganizationSubscription,
    null
  >(
    {
      query: SUBSCRIBE_ORGANIZATION,
    },
    {
      complete: () => undefined,
      next: async (data) => {
        const eventData = data.data?.moderationOrganization
        if (!eventData) return
        console.log('SUB MODERATOR', eventData)

        await processOrganizationEvent(queryClient, eventData)
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

async function processOrganizationEvent(
  queryClient: QueryClient,
  eventData: SubscribeOrganizationSubscription['moderationOrganization']
) {
  if (
    eventData.event ===
      DataHubSubscriptionEventEnum.ModerationOrganizationCreated ||
    eventData.event ===
      DataHubSubscriptionEventEnum.ModerationOrganizationStateUpdated
  ) {
    await processOrganization(queryClient, eventData)
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

async function processOrganization(
  queryClient: QueryClient,
  eventData: SubscribeOrganizationSubscription['moderationOrganization']
) {
  const entity = eventData.entity
  const moderators = entity.organizationModerators

  moderators?.forEach((moderator) => {
    const address = moderator.moderator.substrateAccount.id
    getModeratorQuery.setQueryData(queryClient, address, (oldData) => {
      if (!oldData) return null
      const postIdsSet = new Set(oldData.postIds)
      entity.ctxPostIds?.forEach((id) => postIdsSet.add(id))
      return {
        ...oldData,
        postIds: Array.from(postIdsSet),
      }
    })
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
      { postEntityId: id },
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
          type: 'postEntityId',
          blockedResources: {
            ...resources,
            [resourceType]: newResource,
          },
        }
      }
    )
  })
}
