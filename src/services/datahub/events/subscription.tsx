import Toast from '@/components/Toast'
import { getCurrentWallet } from '@/services/subsocial/hooks'
import { useMyMainAddress } from '@/stores/my-account'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { gql } from 'graphql-request'
import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import sortKeysRecursive from 'sort-keys-recursive'
import {
  SubscribeEventsSubscription,
  SubscribeEventsSubscriptionVariables,
} from '../generated-query'
import { datahubSubscription } from '../utils'

export function useDatahubEventsSubscriber() {
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

const SUBSCRIBE_EVENTS = gql`
  subscription SubscribeEvents($args: AccountServiceMessageInput!) {
    serviceMessageToTarget(args: $args) {
      event
      meta {
        msg
      }
    }
  }
`

async function getMsgArgs(): Promise<SubscribeEventsSubscriptionVariables | null> {
  const { address, signer, proxyToAddress } = getCurrentWallet()
  if (!address) return null

  const msg: SubscribeEventsSubscriptionVariables['args']['msg'] =
    sortKeysRecursive({
      proxy: proxyToAddress ?? '',
      signer: address,
      timestamp: Date.now().toString(),
    })

  const sig = await signer?.signMessage(JSON.stringify(msg))
  if (!sig) return null

  return {
    args: {
      msg,
      sig,
    },
  }
}

let isSubscribed = false
function subscription(queryClient: QueryClient) {
  if (isSubscribed) return
  isSubscribed = true

  const client = datahubSubscription()
  async function subscribe() {
    const args = await getMsgArgs()
    if (!args) return null

    let unsub = client.subscribe<SubscribeEventsSubscription>(
      {
        query: SUBSCRIBE_EVENTS,
        variables: args as SubscribeEventsSubscriptionVariables,
      },
      {
        complete: () => undefined,
        next: async (data) => {
          const eventData = data.data?.serviceMessageToTarget
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
  _: QueryClient,
  eventData: SubscribeEventsSubscription['serviceMessageToTarget']
) {
  if (eventData.meta.msg)
    toast.custom((t) => <Toast t={t} title={eventData.meta.msg} />)
}
