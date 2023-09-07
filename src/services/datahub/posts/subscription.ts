import { getPostQuery } from '@/services/api/query'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { gql } from 'graphql-request'
import { useEffect, useRef } from 'react'
import { PostSubscriptionPayload } from '../generated'
import { datahubSubscription } from '../utils'
import { getCommentIdsByPostIdQuery } from './query'

const SUBSCRIBE_POST = gql`
  subscription Post {
    post {
      event
      entityId
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
  let unsub = client.subscribe<PostSubscriptionPayload, null>(
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

        const id = data.data?.entityId
        await getPostQuery.fetchQuery(queryClient, id)
        getCommentIdsByPostIdQuery.setQueryData(
          queryClient,
          postId,
          (oldIds) => {
            if (!oldIds) return [id]
            return [...oldIds, id]
          }
        )
      },
      error: () => {
        console.log('error subscription')
      },
    }
  )

  return unsub
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
      subscribedPostIds.delete(postId)
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
      unsubs.forEach((unsub, idx) => {
        unsub?.()
        subscribedPostIds.delete(postIds[idx])
      })
    }
  }, [postIds, queryClient, enabled])
}
