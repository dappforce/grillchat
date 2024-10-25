import Toast from '@/components/Toast'
import { linkEvmAddressCallbacks } from '@/components/modals/LinkEvmAddressModal'
import { claimTaskErrorStore } from '@/components/tasks/config'
import { getPostQuery } from '@/services/api/query'
import { deleteOptimisticData } from '@/services/subsocial/commentIds/optimistic'
import { getCurrentWallet } from '@/services/subsocial/hooks'
import { getMyMainAddress, useMyMainAddress } from '@/stores/my-account'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { gql } from 'graphql-request'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import sortKeysRecursive from 'sort-keys-recursive'
import {
  getDailyRewardQuery,
  getTodaySuperLikeCountQuery,
} from '../content-staking/query'
import { syncExternalTokenBalancesCallbacks } from '../externalTokenBalances/mutation'
import {
  ServiceMessageStatusCode,
  SocialCallName,
  SubscribeEventsSubscription,
  SubscribeEventsSubscriptionVariables,
} from '../generated-query'
import {
  getLinkedIdentityQuery,
  getSocialProfileQuery,
} from '../identity/query'
import { callIdToPostIdMap } from '../posts/mutation'
import { getUserPostedMemesForCountQuery } from '../posts/query'
import { getProfileQuery } from '../profiles/query'
import { getGamificationTasksErrorQuery } from '../tasks/query'
import { datahubSubscription } from '../utils'

export function useDatahubEventsSubscriber() {
  const queryClient = useQueryClient()
  const unsubRef = useRef<(() => void) | undefined>()
  const myAddress = useMyMainAddress()

  useEffect(() => {
    if (!myAddress) return

    unsubRef.current = subscription(queryClient)
    return () => {
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
        extension
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
  const mainAddress = getMyMainAddress() ?? ''

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
    case SocialCallName.SynthGamificationClaimEntranceDailyReward:
      action = 'claiming of daily reward'
      break
    case SocialCallName.SynthUpdateLinkedIdentityExternalProvider:
      action = 'updating your Ethereum address'
      break
    case SocialCallName.SynthAddLinkedIdentityExternalProvider:
      action = 'connecting your Ethereum address'
      break
  }

  let reason = ''
  switch (eventData.meta.code) {
    case ServiceMessageStatusCode.ExpiredEntranceDailyRewardClaimForbidden:
      reason = 'You already claimed the daily reward'
      break
    case ServiceMessageStatusCode.FutureEntranceDailyRewardClaimForbidden:
      reason = 'You can claim the daily reward only for the current day'
      break
    case ServiceMessageStatusCode.GamificationTaskClaimFailedDuplicatedClaim:
      reason = 'You already claimed the task reward'
      break
    case ServiceMessageStatusCode.GamificationTaskClaimFailedInvalidData:
      reason = 'Invalid data'
      break
    case ServiceMessageStatusCode.GamificationTaskClaimFailedNotCompleted:
      reason = 'Task is not completed'
      break
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
    case ServiceMessageStatusCode.DailySuperLikesMaxLimitReached:
      reason = 'Daily super likes limit reached'
      break
    case ServiceMessageStatusCode.DailyTapsMaxLimitReached:
      reason = 'Daily taps limit reached'
      break
  }

  if (
    eventData.meta.callName ===
    SocialCallName.SynthSocialProfileSetActionPermissions
  ) {
    const profile = getProfileQuery.getQueryData(
      client,
      eventData.meta.extension?.updatedCreatorAddress ?? ''
    )
    toast.custom((t) => (
      <Toast
        t={t}
        type='default'
        title={`You have approved ${
          profile?.profileSpace?.content?.name || 'user'
        }`}
      />
    ))
    getSocialProfileQuery.invalidate(
      client,
      eventData.meta.extension?.updatedCreatorAddress
    )
    return
  }

  if (eventData.meta.callName === SocialCallName.SynthSetPostApproveStatus) {
    const extension = eventData.meta.extension
    const creatorAddress = extension?.creatorAddress ?? ''
    const postId = extension?.postId ?? ''
    const rootPostId = extension?.rootPostId ?? ''
    const newStatus = extension?.newStatus ?? false
    const profile = getProfileQuery.getQueryData(client, creatorAddress)
    toast.custom((t) => (
      <Toast
        t={t}
        type='default'
        title={`You have approved a meme from ${
          profile?.profileSpace?.content?.name || 'user'
        }`}
      />
    ))
    getUserPostedMemesForCountQuery.setQueryData(
      client,
      { address: creatorAddress, chatId: rootPostId },
      (oldData) => {
        if (!oldData) return oldData
        const index = oldData.findIndex((meme) => meme.id === postId)
        if (index === -1) return oldData
        const meme = oldData[index]
        return [
          ...oldData.slice(0, index),
          { ...meme, approvedInRootPost: newStatus },
          ...oldData.slice(index + 1),
        ]
      }
    )
    getPostQuery.setQueryData(client, postId, (oldData) => {
      if (!oldData) return oldData
      return {
        ...oldData,
        struct: {
          ...oldData.struct,
          approvedInRootPost: newStatus,
        },
      }
    })
    return
  }

  if (eventData.meta.callName === SocialCallName.SynthGamificationClaimTask) {
    claimTaskErrorStore.set(eventData.meta.code)

    getGamificationTasksErrorQuery.setQueryData(client, 'error', () =>
      reason ? eventData.meta.code : 'None'
    )
  }

  if (
    eventData.meta.callName ===
      SocialCallName.SynthUpdateLinkedIdentityExternalProvider ||
    eventData.meta.callName ===
      SocialCallName.SynthAddLinkedIdentityExternalProvider
  ) {
    if (reason) {
      linkEvmAddressCallbacks.onErrorCallbacks.forEach((cb) => cb())
    } else if (eventData.meta.code === ServiceMessageStatusCode.Processed) {
      linkEvmAddressCallbacks.onSuccessCallbacks.forEach((cb) => cb())
      getLinkedIdentityQuery.invalidate(client, getCurrentWallet().address)
    }
  }

  if (
    eventData.meta.callName ===
      SocialCallName.SynthSocialProfileSyncExternalTokenBalance &&
    eventData.meta.code === ServiceMessageStatusCode.InternalServerError
  ) {
    const externalTokenId = eventData.meta.extension.externalTokenId
    if (externalTokenId) {
      syncExternalTokenBalancesCallbacks.triggerCallbacks(
        {
          address: mainAddress,
          externalTokenId: eventData.meta.extension.externalTokenId,
        },
        'onError'
      )
    }
  }

  if (reason) {
    if (eventData.meta.callName === SocialCallName.CreatePost) {
      const callId = eventData.meta.callId
      if (callId) {
        const optimisticId = callIdToPostIdMap.get(callId)
        if (optimisticId)
          deleteOptimisticData({ client, idToDelete: optimisticId })
      }
    } else if (
      eventData.meta.callName ===
      SocialCallName.SynthActiveStakingCreateSuperLike
    ) {
      getTodaySuperLikeCountQuery.setQueryData(
        client,
        mainAddress,
        (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            count: oldData.count - 1,
          }
        }
      )
    } else if (
      eventData.meta.code ===
      ServiceMessageStatusCode.DailySuperLikesMaxLimitReached
    ) {
      getTodaySuperLikeCountQuery.invalidate(client, mainAddress)
    } else if (
      eventData.meta.callName ===
      SocialCallName.SynthGamificationClaimEntranceDailyReward
    ) {
      getDailyRewardQuery.invalidate(client, mainAddress)
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
