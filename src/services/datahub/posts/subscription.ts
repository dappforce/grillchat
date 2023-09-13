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

export function useSubscribeCommentIdsByPostId() {
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
      entityId
      persistentId
      optimisticId
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
  const id = eventData.persistentId || eventData.entityId
  const post = await getPostQuery.fetchQuery(queryClient, id)
  if (post?.struct.rootPostId) {
    getCommentIdsByPostIdQuery.setQueryData(
      queryClient,
      post?.struct.rootPostId,
      (oldIds) => {
        if (!oldIds) return oldIds
        const oldIdsSet = new Set(oldIds)
        if (oldIdsSet.has(id)) return oldIds

        const newIds = [...oldIds]

        const clientOptimisticId = commentIdsOptimisticEncoder.encode(
          eventData.optimisticId ?? ''
        )
        if (oldIdsSet.has(clientOptimisticId)) {
          const optimisticIdIndex = newIds.findIndex(
            (id) => id === clientOptimisticId
          )
          newIds.splice(optimisticIdIndex, 1, id)
          return newIds
        }

        if (eventData.persistentId && oldIdsSet.has(eventData.entityId)) {
          const optimisticIdIndex = newIds.findIndex(
            (id) => id === eventData.entityId
          )
          newIds.splice(optimisticIdIndex, 1, id)
          return newIds
        }

        newIds.push(id)
        return newIds
      }
    )
  }
}
