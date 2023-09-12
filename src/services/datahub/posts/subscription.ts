import { getPostQuery } from '@/services/api/query'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { gql } from 'graphql-request'
import { useEffect } from 'react'
import {
  DataHubSubscriptionEventEnum,
  SubscribePostSubscription,
} from '../generated'
import { datahubSubscription } from '../utils'
import { getCommentIdsByPostIdQuery } from './query'

const SUBSCRIBE_POST = gql`
  subscription SubscribePost {
    post {
      event
      entityId
      persistentId
    }
  }
`

let isSubscribed = false
const subscription = (queryClient: QueryClient) => {
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

        if (
          eventData.event ===
            DataHubSubscriptionEventEnum.PostCreatedOptimistic ||
          eventData.event === DataHubSubscriptionEventEnum.PostCreatedPersistent
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

                if (
                  eventData.persistentId &&
                  oldIdsSet.has(eventData.entityId)
                ) {
                  const newIds = [...oldIds]
                  const optimisticIdIndex = oldIds.findIndex(
                    (id) => id === eventData.entityId
                  )
                  newIds.splice(optimisticIdIndex, 1, id)
                  return newIds
                }

                return [...oldIdsSet, id]
              }
            )
          }
        }
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

export function useSubscribeCommentIdsByPostId() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsub = subscription(queryClient)

    return () => {
      unsub?.()
    }
  }, [queryClient])
}
