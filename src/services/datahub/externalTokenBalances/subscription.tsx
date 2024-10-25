import Toast from '@/components/Toast'
import { getMyMainAddress, useMyMainAddress } from '@/stores/my-account'
import { formatBalanceToNumber } from '@/utils/formatBalance'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { gql } from 'graphql-request'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { SubscribeExternalTokenBalancesSubscription } from '../generated-query'
import { datahubSubscription } from '../utils'
import { syncExternalTokenBalancesCallbacks } from './mutation'
import {
  ExternalTokenBalance,
  getExternalTokenBalancesCache,
  getExternalTokenBalancesQuery,
} from './query'

export function useDatahubExternalTokenBalancesSubscriber() {
  const queryClient = useQueryClient()
  const unsubRef = useRef<(() => void) | undefined>()
  const myAddress = useMyMainAddress()

  useEffect(() => {
    if (!myAddress) return

    const listener = () => {
      unsubRef.current = subscription(queryClient, myAddress!)
    }
    listener()
    return () => {
      unsubRef.current?.()
    }
  }, [queryClient, myAddress])
}

const SUBSCRIBE_EXTERNAL_TOKEN_BALANCES = gql`
  subscription SubscribeExternalTokenBalances($address: String!) {
    socialProfileExternalTokenBalanceSubscription(args: { address: $address }) {
      event
      entity {
        id
        active
        amount
        blockchainAddress
        externalToken {
          id
          address
          decimals
        }
      }
    }
  }
`

export function subscribeExternalTokenBalances(
  queryClient: QueryClient,
  myAddress: string,
  once?: boolean,
  callback?: () => void
) {
  const client = datahubSubscription()
  let unsub = client.subscribe<SubscribeExternalTokenBalancesSubscription>(
    {
      query: SUBSCRIBE_EXTERNAL_TOKEN_BALANCES,
      variables: { address: myAddress },
    },
    {
      complete: () => undefined,
      next: async (data) => {
        const eventData =
          data.data?.socialProfileExternalTokenBalanceSubscription
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
    return subscribeExternalTokenBalances(queryClient, myAddress)
  }

  const unsub = subscribe()

  return () => {
    unsub.then((unsub) => unsub?.())
    isSubscribed = false
  }
}

async function processSubscriptionEvent(
  client: QueryClient,
  eventData: SubscribeExternalTokenBalancesSubscription['socialProfileExternalTokenBalanceSubscription']
) {
  const mainAddress = getMyMainAddress() ?? ''
  getExternalTokenBalancesQuery.setQueryData(client, mainAddress, (oldData) => {
    const newToken: ExternalTokenBalance = {
      ...eventData.entity,
      parsedAmount: formatBalanceToNumber(
        eventData.entity.amount,
        eventData.entity.externalToken.decimals
      ),
    }
    const oldDataBalanceIndex = oldData?.findIndex(
      (balance) => balance.id === eventData.entity.id
    )
    if (oldDataBalanceIndex === -1 || oldDataBalanceIndex === undefined) {
      if (eventData.entity.active) return [...(oldData ?? []), newToken]
      return oldData
    }

    const newData = [...(oldData ?? [])]
    if (eventData.entity.active) {
      newData[oldDataBalanceIndex] = newToken
    } else {
      newData.splice(oldDataBalanceIndex, 1)
    }
    return newData
  })
  toast.custom((t) => (
    <Toast t={t} title='Your balance has been updated successfully' />
  ))
  syncExternalTokenBalancesCallbacks.triggerCallbacks(
    {
      address: mainAddress,
      externalTokenId: eventData.entity.externalToken.id,
    },
    'onSuccess'
  )
  const newData = getExternalTokenBalancesQuery.getQueryData(
    client,
    mainAddress
  )
  getExternalTokenBalancesCache.set(JSON.stringify(newData))
}
