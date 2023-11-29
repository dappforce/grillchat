import { getDatahubConfig } from '@/utils/env/client'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { gql } from 'graphql-request'
import { useEffect, useRef } from 'react'
import { SubscribeBlockedResourcesSubscription } from '../generated-query'
import { datahubSubscription } from '../utils'
import {
  getBlockedInPostIdDetailedQuery,
  getBlockedResourcesQuery,
} from './query'

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
        enabled
        substrateAccount {
          id
          moderationProfile {
            moderatorOrganizations {
              organization {
                ctxPostIds
                ctxSpaceIds
              }
            }
          }
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
  console.log('subscribing')
  let unsub = client.subscribe<SubscribeBlockedResourcesSubscription, null>(
    {
      query: SUBSCRIBE_BLOCKED_RESOURCES,
    },
    {
      complete: () => undefined,
      next: async (data) => {
        const eventData = data.data?.moderationBlockedResource
        console.log('BLOCKED', eventData)
        if (!eventData) return

        // await processSubscriptionEvent(queryClient, eventData)
      },
      error: () => {
        console.log('error subscription')
      },
    }
  )

  return () => {
    unsub()
    isSubscribed = false
  }
}

// async function processSubscriptionEvent(
//   queryClient: QueryClient,
//   eventData: SubscribePostSubscription['post']
// ) {
//   if (
//     eventData.event === DataHubSubscriptionEventEnum.PostCreated ||
//     eventData.event === DataHubSubscriptionEventEnum.PostStateUpdated
//   ) {
//     await processMessage(queryClient, eventData)
//   }
// }

// async function processMessage(
//   queryClient: QueryClient,
//   eventData: SubscribePostSubscription['post']
// ) {
//   const entity = eventData.entity
//   const newestId = entity.persistentId || entity.id

//   const data = getPostQuery.getQueryData(queryClient, entity.id)
//   const notHaveNewestData =
//     !entity.persistentId ||
//     getPostQuery.getQueryData(queryClient, entity.persistentId)
//   if (data && notHaveNewestData) {
//     data.id = newestId
//     data.struct.dataType = eventData.entity.dataType
//     // set initial data for immediate render but refetch it in background
//     getPostQuery.setQueryData(queryClient, newestId, {
//       ...data,
//       struct: { ...data.struct, dataType: eventData.entity.dataType },
//     })
//     getPostQuery.invalidate(queryClient, newestId)
//   } else {
//     await getPostQuery.fetchQuery(queryClient, newestId)
//   }

//   const rootPostId = entity.rootPost?.persistentId
//   if (!rootPostId) return

//   getPaginatedPostsByPostIdFromDatahubQuery.setQueryFirstPageData(
//     queryClient,
//     rootPostId,
//     (oldData) => {
//       if (!oldData) return oldData
//       const oldIdsSet = new Set(oldData)
//       if (oldIdsSet.has(newestId)) return oldData

//       const newIds = [...oldData]

//       const usedAsClientOptimisticId = entity.optimisticId || entity.id
//       const clientOptimisticId = commentIdsOptimisticEncoder.encode(
//         usedAsClientOptimisticId ?? ''
//       )
//       if (oldIdsSet.has(clientOptimisticId)) {
//         const optimisticIdIndex = newIds.findIndex(
//           (id) => id === clientOptimisticId
//         )
//         newIds.splice(optimisticIdIndex, 1, newestId)
//         return newIds
//       }

//       if (entity.persistentId && oldIdsSet.has(entity.id)) {
//         const optimisticIdIndex = newIds.findIndex((id) => id === entity.id)
//         newIds.splice(optimisticIdIndex, 1, newestId)

//         return newIds
//       }

//       newIds.unshift(newestId)
//       return newIds
//     }
//   )

//   getPostMetadataQuery.invalidate(queryClient, rootPostId)
// }
