import { getPostQuery } from '@/services/api/query'
import { commentIdsOptimisticEncoder } from '@/services/subsocial/commentIds/optimistic'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { gql } from 'graphql-request'
import { useEffect } from 'react'
import {
  DataHubSubscriptionEventEnum,
  SubscribePostSubscription,
} from '../generated'
import { datahubSubscription } from '../utils'
import { getCommentIdsByPostIdQuery } from './query'

export function useSubscribePosts() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsub = subscription(queryClient)
    return () => {
      unsub?.()
    }
  }, [queryClient])
}

const SUBSCRIBE_POST = gql`
  subscription SubscribePost {
    post {
      event
      entity {
        id
        persistentId
        optimisticId
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
      complete: () => {
        console.log('subscription completed')
      },
      next: async (data) => {
        console.log('Subscription Data:', data.data)
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
  if (data) {
    data.id = newestId
    // set initial data for immediate render but refetch it in background
    getPostQuery.setQueryData(queryClient, newestId, { ...data })
  }
  getPostQuery.invalidate(queryClient, newestId)

  const rootPostId = entity.rootPost?.persistentId
  if (!rootPostId) return

  getCommentIdsByPostIdQuery.setQueryData(queryClient, rootPostId, (oldIds) => {
    if (!oldIds) return oldIds
    const oldIdsSet = new Set(oldIds)
    if (oldIdsSet.has(newestId)) return oldIds

    const newIds = [...oldIds]

    const clientOptimisticId = commentIdsOptimisticEncoder.encode(
      entity.optimisticId ?? ''
    )
    if (oldIdsSet.has(clientOptimisticId)) {
      const optimisticIdIndex = newIds.findIndex(
        (id) => id === clientOptimisticId
      )
      newIds.splice(optimisticIdIndex, 1, newestId)

      const data = getPostQuery.getQueryData(queryClient, clientOptimisticId)
      if (data) data.id = newestId
      getPostQuery.setQueryData(queryClient, newestId, data)

      return newIds
    }

    if (entity.persistentId && oldIdsSet.has(entity.id)) {
      const optimisticIdIndex = newIds.findIndex((id) => id === entity.id)
      newIds.splice(optimisticIdIndex, 1, newestId)

      return newIds
    }

    newIds.push(newestId)
    return newIds
  })
}
