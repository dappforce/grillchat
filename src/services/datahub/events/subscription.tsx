import Toast from '@/components/Toast'
import { deleteOptimisticData } from '@/services/subsocial/commentIds/optimistic'
import { getCurrentWallet } from '@/services/subsocial/hooks'
import { useMyMainAddress } from '@/stores/my-account'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { gql } from 'graphql-request'
import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import sortKeysRecursive from 'sort-keys-recursive'
import {
  ServiceMessageStatusCode,
  SocialCallName,
  SubscribeEventsSubscription,
  SubscribeEventsSubscriptionVariables,
} from '../generated-query'
import { callIdToPostIdMap } from '../posts/mutation'
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
        callName
        msg
        code
        callId
      }
    }
  }
`

async function getMsgArgs(): Promise<SubscribeEventsSubscriptionVariables | null> {
  const { address, signer, proxyToAddress } = getCurrentWallet()
  if (!address) return null

  const msg: SubscribeEventsSubscriptionVariables['args']['msg'] =
    sortKeysRecursive({
      proxy: proxyToAddress ? address : '',
      signer: proxyToAddress || address,
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
  client: QueryClient,
  eventData: SubscribeEventsSubscription['serviceMessageToTarget']
) {
  let action = 'previous action'
  switch (eventData.meta.callName) {
    case SocialCallName.CreatePost:
      action = 'message'
      break
    case SocialCallName.CreateSpaceAsProfile:
      action = 'profile'
      break
    case SocialCallName.SynthActiveStakingCreateSuperLike:
      action = 'like'
      break
  }

  let reason = ''
  switch (eventData.meta.code) {
    case ServiceMessageStatusCode.Unauthorized:
      reason = 'You are not authorized to perform this action'
      break
    case ServiceMessageStatusCode.Forbidden:
      reason = 'You are not allowed to perform this action'
      break
    case ServiceMessageStatusCode.EntityAlreadyExists:
      reason = 'The entity already exists'
      break
    case ServiceMessageStatusCode.EntityNotFound:
      reason = 'The entity was not found'
      break
    case ServiceMessageStatusCode.TooManyRequests:
      reason = 'Too many requests'
      break
    case ServiceMessageStatusCode.ServiceUnavailable:
      reason = 'Service unavailable'
      break
    case ServiceMessageStatusCode.InternalServerError:
      reason = 'Internal server error'
      break
    case ServiceMessageStatusCode.UnprocessableEntity:
      reason = 'Entity is not processable'
      break
    case ServiceMessageStatusCode.PaymentRequired:
      reason = 'Payment required'
      break
    case ServiceMessageStatusCode.InsufficientBalance:
      reason = 'Insufficient balance'
      break
    case ServiceMessageStatusCode.BadRequest:
      reason = 'Bad request'
      break
    case ServiceMessageStatusCode.InvalidSigner:
      reason = 'Invalid signer, please relogin and try again'
      break
    case ServiceMessageStatusCode.InvalidProxyForSigner:
      reason = 'Invalid proxy, please relogin and try again'
      break
  }
  if (reason) {
    if (eventData.meta.callName === SocialCallName.CreatePost) {
      const callId = eventData.meta.callId
      if (callId) {
        const optimisticId = callIdToPostIdMap.get(callId)
        if (optimisticId)
          deleteOptimisticData({ client, idToDelete: optimisticId })
      }
    }

    toast.custom((t) => (
      <Toast
        t={t}
        type='error'
        title={`Failed to process ${action}`}
        description={reason}
      />
    ))
  } else if (
    eventData.meta.code === ServiceMessageStatusCode.Warning &&
    eventData.meta.msg
  ) {
    toast.custom((t) => <Toast t={t} title={eventData.meta.msg} />)
  }
}
