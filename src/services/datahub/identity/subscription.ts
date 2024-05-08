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
    linkedIdentitySubscription {
      event
      entity {
        linkedIdentity {
          id
          externalProviders {
            id
            externalId
            provider
            enabled
          }
        }
        session {
          id
          linkedIdentity {
            externalProviders {
              id
              externalId
              provider
              enabled
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
  let unsub = client.subscribe<SubscribeIdentitySubscription, null>(
    {
      query: SUBSCRIBE_IDENTITY,
    },
    {
      complete: () => undefined,
      next: async (data) => {
        const eventData = data.data?.linkedIdentitySubscription
        if (!eventData) return

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
  eventData: SubscribeIdentitySubscription['linkedIdentitySubscription']
) {
  if (
    eventData.event ===
    DataHubSubscriptionEventEnum.LinkedIdentitySessionCreated
  ) {
    await processIdentity(queryClient, eventData.entity.session)
  }
}

async function processIdentity(
  queryClient: QueryClient,
  session: SubscribeIdentitySubscription['linkedIdentitySubscription']['entity']['session']
) {
  if (!session?.id) return
  getLinkedIdentityQuery.invalidate(queryClient, session.id)
}
