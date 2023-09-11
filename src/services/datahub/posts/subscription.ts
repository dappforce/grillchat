import { getPostQuery } from '@/services/api/query'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { gql } from 'graphql-request'
import { useEffect, useRef } from 'react'
import { SubscribePostSubscription } from '../generated'
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

const subscribedPostIds = new Set<string>()
const subscription = (
  enabled: boolean,
  postId: string,
  queryClient: QueryClient
) => {
  if (!enabled || subscribedPostIds.has(postId)) return
  subscribedPostIds.add(postId)

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
        if (!data.data) return

        const id = data.data?.post.entityId
        await getPostQuery.fetchQuery(queryClient, id)
        getCommentIdsByPostIdQuery.setQueryData(
          queryClient,
          postId,
          (oldIds) => {
            if (!oldIds) return [id]
            if (oldIds.includes(id)) return oldIds
            return [...oldIds, id]
          }
        )
      },
      error: () => {
        console.log('error subscription')
      },
    }
  )

  return () => {
    unsub()
    subscribedPostIds.delete(postId)
  }
}

export function useSubscribeCommentIdsByPostId(
  postId: string,
  enabled: boolean
) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsub = subscription(enabled, postId, queryClient)

    return () => {
      unsub?.()
    }
  }, [postId, queryClient, enabled])
}

export function useSubscribeCommentIdsByPostIds(
  postIds: string[],
  enabled: boolean
) {
  const queryClient = useQueryClient()

  const lastIdInPreviousSub = useRef<Record<string, string | undefined>>({})

  useEffect(() => {
    const unsubs = postIds.map((postId) => {
      return subscription(enabled, postId, queryClient)
    })

    return () => {
      lastIdInPreviousSub.current = {}
      unsubs.forEach((unsub) => {
        unsub?.()
      })
    }
  }, [postIds, queryClient, enabled])
}
