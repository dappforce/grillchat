import { getMyMainAddress, useMyAccount } from '@/stores/my-account'
import { useSubscriptionState } from '@/stores/subscription'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { gql } from 'graphql-request'
import { useEffect, useRef } from 'react'
import {
  DataHubSubscriptionEventEnum,
  SubscribeIdentitySubscription,
} from '../generated-query'
import { datahubSubscription, isDatahubAvailable } from '../utils'
import { Identity } from './fetcher'
import { getLinkedIdentityQuery, getMyLinkedIdentityCache } from './query'

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
        session {
          id
          linkedIdentity {
            id
            externalProviders {
              id
              username
              externalId
              provider
              enabled
              createdAtTime
            }
          }
        }
        externalProvider {
          id
          externalId
          provider
          enabled
          username
          createdAtTime
          linkedIdentity {
            id
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
    await processSessionCreated(queryClient, eventData.entity.session)
  } else if (
    eventData.event ===
      DataHubSubscriptionEventEnum.LinkedIdentityExternalProviderCreated ||
    eventData.event ===
      DataHubSubscriptionEventEnum.LinkedIdentityExternalProviderStateUpdated
  ) {
    await processExternalProviderUpdate(
      queryClient,
      eventData.entity.externalProvider
    )
  }
}

async function processSessionCreated(
  queryClient: QueryClient,
  session: SubscribeIdentitySubscription['linkedIdentitySubscription']['entity']['session']
) {
  if (!session?.id) return
  const newIdentity: Identity = {
    mainAddress: session.linkedIdentity.id,
    externalProviders:
      session.linkedIdentity.externalProviders?.map((p) => ({
        id: p.id,
        externalId: p.externalId,
        provider: p.provider,
        username: p.username,
        createdAtTime: p.createdAtTime,
        enabled: p.enabled,
      })) ?? [],
  }
  if (session.id === useMyAccount.getState().address)
    getMyLinkedIdentityCache.set(JSON.stringify(newIdentity))
  getLinkedIdentityQuery.setQueryData(queryClient, session.id, newIdentity)
}

async function processExternalProviderUpdate(
  queryClient: QueryClient,
  externalProvider: SubscribeIdentitySubscription['linkedIdentitySubscription']['entity']['externalProvider']
) {
  const myGrillAddress = useMyAccount.getState().address
  if (!myGrillAddress || !externalProvider) return

  const myMainAddress = getMyMainAddress()
  if (!myMainAddress || externalProvider.linkedIdentity.id !== myMainAddress)
    return

  getLinkedIdentityQuery.setQueryData(queryClient, myGrillAddress, (data) => {
    if (!data) return data
    const hasIncludedCurrentProvider = data.externalProviders.some((p) => {
      return (
        p.provider === externalProvider.provider &&
        p.externalId === externalProvider.externalId
      )
    })
    if (hasIncludedCurrentProvider) return data
    return {
      ...data,
      externalProviders: [
        ...data.externalProviders,
        {
          id: externalProvider.id,
          externalId: externalProvider.externalId,
          provider: externalProvider.provider,
          enabled: externalProvider.enabled,
          username: externalProvider.username,
          createdAtTime: externalProvider.createdAtTime,
        },
      ],
    }
  })
}
