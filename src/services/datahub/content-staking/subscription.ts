import { useMyMainAddress } from '@/stores/my-account'
import { useSubscriptionState } from '@/stores/subscription'
import { DataHubSubscriptionEventEnum } from '@subsocial/data-hub-sdk'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { gql } from 'graphql-request'
import { useEffect, useRef } from 'react'
import { datahubSubscription, isDatahubAvailable } from '../utils'
import { getAddressLikeCountToPostQuery, getSuperLikeCountQuery } from './query'

export function useDatahubContentStakingSubscriber() {
  const queryClient = useQueryClient()
  const myAddress = useMyMainAddress() ?? undefined
  const unsubRef = useRef<(() => void) | undefined>()
  const subState = useSubscriptionState(
    (state) => state.subscriptionState['identity']
  )

  useEffect(() => {
    if (subState === 'always-sub')
      unsubRef.current = subscription(queryClient, myAddress)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subState, queryClient])

  useEffect(() => {
    if (!isDatahubAvailable) return

    const listener = () => {
      if (document.visibilityState === 'visible') {
        unsubRef.current = subscription(queryClient, myAddress)
      } else {
        if (
          useSubscriptionState.getState().subscriptionState[
            'creator-staking'
          ] === 'dynamic'
        ) {
          unsubRef.current?.()
        }
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

const SUBSCRIBE_SUPER_LIKE = gql`
  subscription SubscribeSuperLike {
    activeStakingSuperLike {
      event
      entity {
        staker {
          id
        }
        post {
          persistentId
        }
      }
    }
  }
`

let isSubscribed = false
export function subscription(
  queryClient: QueryClient,
  myAddress: string | undefined
) {
  if (isSubscribed) return
  isSubscribed = true

  const client = datahubSubscription()
  let unsub = client.subscribe(
    {
      query: SUBSCRIBE_SUPER_LIKE,
    },
    {
      complete: () => undefined,
      next: async (data) => {
        const eventData = data.data?.activeStakingSuperLike
        if (!eventData) return

        await processSubscriptionEvent(queryClient, eventData as any, myAddress)
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
  eventData: {
    event: DataHubSubscriptionEventEnum
    entity: { staker: { id: string }; post: { persistentId: string } }
  },
  myAddress: string | undefined
) {
  if (
    eventData.event !==
      DataHubSubscriptionEventEnum.ACTIVE_STAKING_SUPER_LIKE_CREATED &&
    eventData.event !==
      DataHubSubscriptionEventEnum.ACTIVE_STAKING_SUPER_LIKE_STATE_UPDATED
  )
    return

  const { post, staker } = eventData.entity

  getSuperLikeCountQuery.invalidate(queryClient, post.persistentId)
  if (staker.id === myAddress) {
    getAddressLikeCountToPostQuery.invalidate(queryClient, {
      address: myAddress,
      postId: post.persistentId,
    })
  }
}
