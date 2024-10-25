import LinkText from '@/components/LinkText'
import Toast from '@/components/Toast'
import { env } from '@/env.mjs'
import { getPostQuery } from '@/services/api/query'
import { getMyMainAddress, useMyMainAddress } from '@/stores/my-account'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { gql } from 'graphql-request'
import { useEffect, useRef } from 'react'
import { HiOutlineInformationCircle } from 'react-icons/hi2'
import { toast } from 'sonner'
import {
  DataHubSubscriptionEventEnum,
  GetBlockedInPostIdDetailedQuery,
  SubscribeBlockedResourcesSubscription,
  SubscribeOrganizationSubscription,
} from '../generated-query'
import { isPersistentId } from '../posts/fetcher'
import { blockedCountOffset } from '../posts/query'
import { datahubSubscription, isDatahubAvailable } from '../utils'
import {
  getBlockedInPostIdDetailedQuery,
  getBlockedResourcesQuery,
  getModeratorQuery,
} from './query'
import { ResourceTypes, getBlockedResourceType } from './utils'

export function useDatahubModerationSubscriber() {
  const queryClient = useQueryClient()
  const unsubRef = useRef<(() => void) | undefined>()
  const myAddress = useMyMainAddress()

  useEffect(() => {
    if (!isDatahubAvailable) return

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
            account {
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
        ctxAppIds
        rootPostId
        createdAt
        organization {
          ctxPostIds
          ctxAppIds
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
        console.error('error blocked resources subscription', err)
      },
    }
  )

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

        await processOrganizationEvent(queryClient, eventData)
      },
      error: (err) => {
        console.error('error moderator subscription', err)
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

const processedJustNowIds = new Set<string>()
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
    // prevent double processing of the same event
    // because now if we block resource we get 2 events simultaneously
    if (
      eventData.event ===
        DataHubSubscriptionEventEnum.ModerationBlockedResourceCreated &&
      eventData.entity.blocked
    ) {
      processedJustNowIds.add(eventData.entity.id)
      setTimeout(() => {
        processedJustNowIds.delete(eventData.entity.id)
      }, 1000)
    } else if (
      processedJustNowIds.has(eventData.entity.id) &&
      eventData.event ===
        DataHubSubscriptionEventEnum.ModerationBlockedResourceStateUpdated &&
      eventData.entity.blocked
    ) {
      return
    }
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
    const address = moderator.moderator.account.id
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
  const { blocked: isNowBlocked, createdAt, resourceId } = entity
  const resourceType = getBlockedResourceType(resourceId)

  const ctxPostIds = entity.organization.ctxPostIds

  if (!resourceType) return

  const ctxAppIds = entity.organization.ctxAppIds
  const entityAppId = entity.ctxAppIds
  const appId = env.NEXT_PUBLIC_APP_ID

  const isBlockedInAppContext =
    isNowBlocked && entityAppId.some((id) => id === appId || id === '*')
  const isAppContextRelated =
    appId &&
    ctxAppIds?.includes(appId) &&
    (isBlockedInAppContext || !isNowBlocked)

  // if the post id was rendered before, and its unapproved, add the blocked offset to pending tabs pagination
  if (resourceType === 'postId') {
    const post = getPostQuery.getQueryData(queryClient, resourceId)
    if (post && !post.struct.approvedInRootPost) {
      blockedCountOffset.blocked++
    }
  }

  if (isAppContextRelated) {
    getBlockedResourcesQuery.setQueryData(queryClient, { appId }, (oldData) => {
      if (oldData === undefined) return undefined
      const newResources = updateBlockedResourceData(oldData, {
        isNowBlocked,
        resourceId,
        resourceType,
      })
      return {
        id: appId,
        type: 'appId',
        blockedResources: newResources,
      }
    })
    // getBlockedInAppDetailedQuery.setQueryData(queryClient, null, (oldData) => {
    //   if (oldData === undefined) return undefined
    //   return updateBlockedResourceDetailedData(oldData, {
    //     isNowBlocked,
    //     reason: entity.reason,
    //     resourceId,
    //     resourceType,
    //     createdAt,
    //   })
    // })
  } else {
    ctxPostIds?.forEach((id) => {
      getBlockedResourcesQuery.setQueryData(
        queryClient,
        { postEntityId: id },
        (oldData) => {
          if (oldData === undefined) return undefined
          const newResources = updateBlockedResourceData(oldData, {
            isNowBlocked,
            resourceId,
            resourceType,
          })
          return {
            id,
            type: 'postEntityId',
            blockedResources: newResources,
          }
        }
      )

      // getBlockedInPostIdDetailedQuery.setQueryData(
      //   queryClient,
      //   id,
      //   (oldData) => {
      //     if (oldData === undefined) return undefined
      //     return updateBlockedResourceDetailedData(oldData, {
      //       isNowBlocked,
      //       reason: entity.reason,
      //       resourceId,
      //       resourceType,
      //       createdAt,
      //     })
      //   }
      // )
    })
  }

  async function notifyUserIfModerated() {
    const myAddress = getMyMainAddress()
    if (!myAddress) return

    if (resourceType === 'postId' && entity.rootPostId) {
      const [message, chat] = await Promise.all([
        getPostQuery.fetchQuery(queryClient, resourceId),
        getPostQuery.fetchQuery(queryClient, entity.rootPostId),
      ] as const)

      if (message?.struct.ownerId === myAddress) {
        toast.custom((t) => (
          <Toast
            t={t}
            icon={(classNames) => (
              <HiOutlineInformationCircle className={classNames} />
            )}
            title={`Your message is moderated with reason ${entity.reason.reasonText} in the chat ${chat?.content?.title}`}
            subtitle={
              isPersistentId(message.id) && (
                <p>
                  You can still see your message{' '}
                  <LinkText
                    variant='primary'
                    href={`https://x.gazer.app/comments/${message.id}`}
                    openInNewTab
                  >
                    here
                  </LinkText>
                </p>
              )
            }
          />
        ))
      }
    }
  }
  notifyUserIfModerated()
}

function updateBlockedResourceData(
  oldData:
    | {
        id: string
        blockedResources: Record<ResourceTypes, string[]>
        type: 'spaceId' | 'postEntityId' | 'appId'
      }
    | null
    | undefined,
  newData: {
    resourceType: ResourceTypes
    resourceId: string
    isNowBlocked: boolean
  }
) {
  const { isNowBlocked, resourceId, resourceType } = newData

  const resources: Record<ResourceTypes, string[]> =
    oldData?.blockedResources || {
      address: [],
      cid: [],
      postId: [],
    }

  const newResource = [...resources[resourceType]]
  if (isNowBlocked) {
    newResource.push(resourceId)
  } else {
    newResource.splice(newResource.indexOf(resourceId), 1)
  }
  return {
    ...resources,
    [resourceType]: newResource,
  }
}

function updateBlockedResourceDetailedData(
  oldData:
    | Record<
        ResourceTypes,
        GetBlockedInPostIdDetailedQuery['moderationBlockedResourcesDetailed'][number][]
      >
    | null
    | undefined,
  newData: {
    resourceType: ResourceTypes
    resourceId: string
    isNowBlocked: boolean
    reason: GetBlockedInPostIdDetailedQuery['moderationBlockedResourcesDetailed'][number]['reason']
    createdAt: string
  }
) {
  const { isNowBlocked, resourceId, resourceType, reason, createdAt } = newData
  const resources: Record<
    ResourceTypes,
    GetBlockedInPostIdDetailedQuery['moderationBlockedResourcesDetailed'][number][]
  > = oldData || { address: [], cid: [], postId: [] }

  const newResource = [...resources[resourceType]]
  if (isNowBlocked) {
    newResource.push({
      createdAt,
      resourceId,
      reason,
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
}
