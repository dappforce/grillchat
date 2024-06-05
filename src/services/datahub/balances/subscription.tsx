import { getMyMainAddress, useMyMainAddress } from '@/stores/my-account'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { gql } from 'graphql-request'
import { useEffect, useRef } from 'react'
import { getBalanceQuery } from '../balances/query'
import { SubscribeBalancesSubscription } from '../generated-query'
import { datahubSubscription } from '../utils'

export function useDatahubBalancesSubscriber() {
  const queryClient = useQueryClient()
  const unsubRef = useRef<(() => void) | undefined>()
  const myAddress = useMyMainAddress()

  useEffect(() => {
    if (!myAddress) return

    const listener = () => {
      unsubRef.current = subscription(queryClient)
    }
    listener()
    document.addEventListener('visibilitychange', listener)
    return () => {
      document.removeEventListener('visibilitychange', listener)
      unsubRef.current?.()
    }
  }, [queryClient, myAddress])
}

const SUBSCRIBE_BALANCES = gql`
  subscription SubscribeBalances {
    socialProfileBalancesSubscription {
      event
      entity {
        activeStakingPoints
      }
    }
  }
`

let isSubscribed = false
function subscription(queryClient: QueryClient) {
  if (isSubscribed) return
  isSubscribed = true

  const client = datahubSubscription()
  async function subscribe() {
    let unsub = client.subscribe<SubscribeBalancesSubscription>(
      { query: SUBSCRIBE_BALANCES },
      {
        complete: () => undefined,
        next: async (data) => {
          const eventData = data.data?.socialProfileBalancesSubscription
          if (!eventData) return

          await processSubscriptionEvent(queryClient, eventData)
        },
        error: () => {
          console.error('error subscription')
        },
      }
    )
    return unsub
  }

  const unsub = subscribe()

  return () => {
    unsub.then((unsub) => unsub?.())
    isSubscribed = false
  }
}

async function processSubscriptionEvent(
  client: QueryClient,
  eventData: SubscribeBalancesSubscription['socialProfileBalancesSubscription']
) {
  const mainAddress = getMyMainAddress() ?? ''
  getBalanceQuery.setQueryData(
    client,
    mainAddress,
    Number(eventData.entity.activeStakingPoints)
  )
}
