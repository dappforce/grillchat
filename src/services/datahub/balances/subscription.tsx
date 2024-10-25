import { getMyMainAddress, useMyMainAddress } from '@/stores/my-account'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { gql } from 'graphql-request'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { SubscribeBalancesSubscription } from '../generated-query'
import {
  getBalanceQuery,
  getMyBalanceCache,
} from '../leaderboard/points-balance/query'
import { datahubSubscription } from '../utils'

export function useDatahubBalancesSubscriber() {
  const queryClient = useQueryClient()
  const unsubRef = useRef<(() => void) | undefined>()
  const myAddress = useMyMainAddress()
  const { pathname } = useRouter()

  useEffect(() => {
    if (!myAddress || pathname !== '/tg/channels') return

    const listener = () => {
      unsubRef.current = subscription(queryClient, myAddress!)
    }
    listener()
    document.addEventListener('visibilitychange', listener)
    return () => {
      document.removeEventListener('visibilitychange', listener)
      unsubRef.current?.()
    }
  }, [queryClient, myAddress, pathname])
}

const SUBSCRIBE_BALANCES = gql`
  subscription SubscribeBalances($address: String!) {
    socialProfileBalancesSubscription(args: { address: $address }) {
      event
      entity {
        activeStakingPoints
      }
    }
  }
`

export function subscribeBalance(
  queryClient: QueryClient,
  myAddress: string,
  once?: boolean,
  callback?: () => void
) {
  const client = datahubSubscription()
  let unsub = client.subscribe<SubscribeBalancesSubscription>(
    { query: SUBSCRIBE_BALANCES, variables: { address: myAddress } },
    {
      complete: () => undefined,
      next: async (data) => {
        const eventData = data.data?.socialProfileBalancesSubscription
        if (!eventData) return

        await processSubscriptionEvent(queryClient, eventData)
        callback?.()
        if (once) {
          unsub()
        }
      },
      error: () => {
        console.error('error subscription')
      },
    }
  )
  return unsub
}

let isSubscribed = false
export function subscription(queryClient: QueryClient, myAddress: string) {
  if (isSubscribed) return
  isSubscribed = true

  async function subscribe() {
    return subscribeBalance(queryClient, myAddress)
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
  getMyBalanceCache.set(eventData.entity.activeStakingPoints)
}
