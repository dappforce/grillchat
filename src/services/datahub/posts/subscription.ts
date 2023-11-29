import { getPostQuery } from '@/services/api/query'
import { commentIdsOptimisticEncoder } from '@/services/subsocial/commentIds/optimistic'
import { getDatahubConfig } from '@/utils/env/client'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { gql } from 'graphql-request'
import { useEffect, useRef } from 'react'
import {
  DataHubSubscriptionEventEnum,
  SubscribePostSubscription,
} from '../generated-query'
import { datahubSubscription } from '../utils'
import {
  getPaginatedPostsByPostIdFromDatahubQuery,
  getPostMetadataQuery,
} from './query'

// Note: careful when using this in several places, if you have 2 places, the first one will be the one subscribing
// the subscription will only be one, but if the first place is unmounted, it will unsubscribe, making all other places unsubscribed too
export function useDatahubSubscriber(subscribedPostId?: string) {
  const queryClient = useQueryClient()
  const unsubRef = useRef<(() => void) | undefined>()

  useEffect(() => {
    if (!getDatahubConfig()) return

    const listener = () => {
      if (document.visibilityState === 'visible') {
        unsubRef.current = subscription(queryClient)
        // invalidate first page so it will refetch after the websocket connection is disconnected previously when the user is not in the tab
        if (subscribedPostId) {
          getPaginatedPostsByPostIdFromDatahubQuery.invalidateFirstQuery(
            queryClient,
            subscribedPostId
          )
        }
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
  }, [queryClient, subscribedPostId])
}

const SUBSCRIBE_POST = gql`
  subscription SubscribePost {
    post {
      event
      entity {
        id
        persistentId
        optimisticId
        dataType
        rootPost {
          persistentId
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
  let unsub = client.subscribe<SubscribePostSubscription, null>(
    {
      query: SUBSCRIBE_POST,
    },
    {
      complete: () => undefined,
      next: async (data) => {
        const eventData = data.data?.post
        if (!eventData) return

        await processSubscriptionEvent(queryClient, eventData)
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

async function processSubscriptionEvent(
  queryClient: QueryClient,
  eventData: SubscribePostSubscription['post']
) {
  if (
    eventData.event === DataHubSubscriptionEventEnum.PostCreated ||
    eventData.event === DataHubSubscriptionEventEnum.PostStateUpdated
  ) {
    await processMessage(queryClient, eventData)
  }
}

async function processMessage(
  queryClient: QueryClient,
  eventData: SubscribePostSubscription['post']
) {
  const entity = eventData.entity
  const newestId = entity.persistentId || entity.id

  const data = getPostQuery.getQueryData(queryClient, entity.id)
  const notHaveNewestData =
    !entity.persistentId ||
    getPostQuery.getQueryData(queryClient, entity.persistentId)
  if (data && notHaveNewestData) {
    data.id = newestId
    data.struct.dataType = eventData.entity.dataType
    // set initial data for immediate render but refetch it in background
    getPostQuery.setQueryData(queryClient, newestId, {
      ...data,
      struct: { ...data.struct, dataType: eventData.entity.dataType },
    })
    getPostQuery.invalidate(queryClient, newestId)
  } else {
    await getPostQuery.fetchQuery(queryClient, newestId)
  }

  const rootPostId = entity.rootPost?.persistentId
  if (!rootPostId) return

  getPaginatedPostsByPostIdFromDatahubQuery.setQueryFirstPageData(
    queryClient,
    rootPostId,
    (oldData) => {
      if (!oldData) return oldData
      const oldIdsSet = new Set(oldData)
      if (oldIdsSet.has(newestId)) return oldData

      const newIds = [...oldData]

      const usedAsClientOptimisticId = entity.optimisticId || entity.id
      const clientOptimisticId = commentIdsOptimisticEncoder.encode(
        usedAsClientOptimisticId ?? ''
      )
      if (oldIdsSet.has(clientOptimisticId)) {
        const optimisticIdIndex = newIds.findIndex(
          (id) => id === clientOptimisticId
        )
        newIds.splice(optimisticIdIndex, 1, newestId)
        return newIds
      }

      if (entity.persistentId && oldIdsSet.has(entity.id)) {
        const optimisticIdIndex = newIds.findIndex((id) => id === entity.id)
        newIds.splice(optimisticIdIndex, 1, newestId)

        return newIds
      }

      newIds.unshift(newestId)
      return newIds
    }
  )

  getPostMetadataQuery.invalidate(queryClient, rootPostId)
}
