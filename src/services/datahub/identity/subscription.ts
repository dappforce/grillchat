import { useSubscriptionState } from '@/stores/subscription'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { gql } from 'graphql-request'
import { useEffect, useRef } from 'react'
import {
  DataHubSubscriptionEventEnum,
  SubscribeIdentitySubscription,
} from '../generated-query'
import { datahubSubscription, isDatahubAvailable } from '../utils'
import { getLinkedIdentityQuery } from './query'

export function useDatahubIdentitySubscriber() {
  const queryClient = useQueryClient()
  const unsubRef = useRef<(() => void) | undefined>()
  const subState = useSubscriptionState(
    (state) => state.subscriptionState['identity']
  )

  useEffect(() => {
    if (subState === 'always-sub') unsubRef.current = subscription(queryClient)
  }, [subState, queryClient])

  useEffect(() => {
    if (!isDatahubAvailable) return

    const listener = () => {
      if (document.visibilityState === 'visible') {
        unsubRef.current = subscription(queryClient)
      } else {
        if (
          useSubscriptionState.getState().subscriptionState['identity'] ===
          'dynamic'
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
  }, [queryClient])
}

const SUBSCRIBE_IDENTITY = gql`
  subscription SubscribeIdentity {
    linkedIdentity {
      event
      entity {
        substrateAccount {
          id
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
  let unsub = client.subscribe<SubscribeIdentitySubscription, null>(
    {
      query: SUBSCRIBE_IDENTITY,
    },
    {
      complete: () => undefined,
      next: async (data) => {
        const eventData = data.data?.linkedIdentity
        if (!eventData) return
        console.log('EVENT', eventData)

        await processSubscriptionEvent(queryClient, eventData)
      },
      error: () => {
        console.error('error subscription')
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
  eventData: SubscribeIdentitySubscription['linkedIdentity']
) {
  if (
    eventData.event === DataHubSubscriptionEventEnum.LinkedIdentityCreated ||
    eventData.event === DataHubSubscriptionEventEnum.LinkedIdentityStateUpdated
  ) {
    await processIdentity(queryClient, eventData)
  }
}

async function processIdentity(
  queryClient: QueryClient,
  eventData: SubscribeIdentitySubscription['linkedIdentity']
) {
  getLinkedIdentityQuery.invalidate(
    queryClient,
    eventData.entity.substrateAccount.id
  )
}
