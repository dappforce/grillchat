import Toast from '@/components/Toast'
import { MIN_MEME_FOR_REVIEW } from '@/constants/chat'
import { getPostQuery } from '@/services/api/query'
import { commentIdsOptimisticEncoder } from '@/services/subsocial/commentIds/optimistic'
import { useMessageData } from '@/stores/message'
import { getMyMainAddress, useMyMainAddress } from '@/stores/my-account'
import { useSubscriptionState } from '@/stores/subscription'
import { cx } from '@/utils/class-names'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { gql } from 'graphql-request'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { getTokenomicsMetadataQuery } from '../content-staking/query'
import {
  DataHubSubscriptionEventEnum,
  SubscribePostSubscription,
} from '../generated-query'
import { datahubSubscription, isDatahubAvailable } from '../utils'
import { lastSentMessageStorage } from './mutation'
import {
  getPaginatedPostIdsByPostId,
  getPostMetadataQuery,
  getTimeLeftUntilCanPostQuery,
  getUnapprovedMemesCountQuery,
} from './query'

// Note: careful when using this in several places, if you have 2 places, the first one will be the one subscribing
// the subscription will only be one, but if the first place is unmounted, it will unsubscribe, making all other places unsubscribed too
export function useDatahubPostSubscriber(subscribedPostId?: string) {
  const myAddress = useMyMainAddress()
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
      if (document.visibilityState === 'visible' && myAddress) {
        unsubRef.current = subscription(queryClient)
        // invalidate first page so it will refetch after the websocket connection is disconnected previously when the user is not in the tab
        if (subscribedPostId) {
          getPaginatedPostIdsByPostId.invalidateFirstQuery(queryClient, {
            postId: subscribedPostId,
            onlyDisplayUnapprovedMessages: false,
            myAddress,
          })
        }
      } else {
        if (
          useSubscriptionState.getState().subscriptionState['post'] ===
          'dynamic'
        )
          unsubRef.current?.()
      }
    }
    listener()
    document.addEventListener('visibilitychange', listener)
    return () => {
      document.removeEventListener('visibilitychange', listener)
      unsubRef.current?.()
    }
  }, [queryClient, subscribedPostId, myAddress])
}

const SUBSCRIBE_POST = gql`
  subscription SubscribePost {
    post {
      event
      entity {
        id
        persistentId
        optimisticId
        dataType
        approvedInRootPost
        createdAtTime
        rootPost {
          persistentId
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
  let unsub = client.subscribe<SubscribePostSubscription, null>(
    {
      query: SUBSCRIBE_POST,
    },
    {
      complete: () => undefined,
      next: async (data) => {
        const eventData = data.data?.post
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
  eventData: SubscribePostSubscription['post']
) {
  if (
    eventData.event === DataHubSubscriptionEventEnum.PostCreated ||
    eventData.event === DataHubSubscriptionEventEnum.PostStateUpdated
  ) {
    await processMessage(
      queryClient,
      eventData,
      eventData.event === DataHubSubscriptionEventEnum.PostCreated
    )
  }
}

async function processMessage(
  queryClient: QueryClient,
  eventData: SubscribePostSubscription['post'],
  isCreationEvent?: boolean
) {
  const entity = eventData.entity
  const newestId = entity.persistentId || entity.id

  const dataFromEntityId = getPostQuery.getQueryData(queryClient, entity.id)
  const dataFromPersistentId =
    entity.persistentId &&
    getPostQuery.getQueryData(queryClient, entity.persistentId)
  const notHaveNewestData = !dataFromPersistentId

  if (dataFromEntityId && notHaveNewestData) {
    dataFromEntityId.id = newestId
    dataFromEntityId.struct.dataType = eventData.entity.dataType
    // set initial data for immediate render but refetch it in background
    getPostQuery.setQueryData(queryClient, newestId, {
      ...dataFromEntityId,
      struct: {
        ...dataFromEntityId.struct,
        dataType: eventData.entity.dataType,
      },
    })
    getPostQuery.invalidate(queryClient, newestId)
  } else {
    if (dataFromPersistentId) {
      getPostQuery.setQueryData(queryClient, newestId, (oldData) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          struct: {
            ...oldData.struct,
            approvedInRootPost: eventData.entity.approvedInRootPost,
          },
        }
      })
      await getPostQuery.invalidate(queryClient, newestId)
    } else {
      await getPostQuery.fetchQuery(queryClient, newestId)
    }
  }

  const newPost = getPostQuery.getQueryData(queryClient, newestId)
  const myAddress = getMyMainAddress()

  const rootPostId = entity.rootPost?.persistentId
  const ownerId = newPost?.struct.ownerId
  const isCurrentOwner = ownerId === myAddress

  if (isCreationEvent) {
    const tokenomics = await getTokenomicsMetadataQuery.fetchQuery(
      queryClient,
      null
    )
    if (isCreationEvent && newPost) {
      if (newPost.struct.approvedInRootPost) {
        if (isCurrentOwner) {
          toast.custom((t) => (
            <Toast
              icon={(className) => (
                <span className={cx(className, 'text-base')}>✨</span>
              )}
              t={t}
              title='Meme Sent!'
              description={`${tokenomics.socialActionPrice.createCommentPoints} points have been used. More memes, more fun!`}
            />
          ))
        }
      } else {
        // to not wait for another query to run the other synchronous actions below
        processUnapprovedMeme()
        async function processUnapprovedMeme() {
          if (ownerId) {
            const cachedCount = getUnapprovedMemesCountQuery.getQueryData(
              queryClient,
              { address: ownerId, chatId: rootPostId ?? '' }
            )
            if (cachedCount) {
              getUnapprovedMemesCountQuery.setQueryData(
                queryClient,
                { address: ownerId, chatId: rootPostId ?? '' },
                (count) => ({
                  ids: [...(count?.ids ?? []), entity.id],
                  unapproved: (count?.unapproved ?? 0) + 1,
                  approved: count?.approved ?? 0,
                })
              )
            } else if (isCurrentOwner) {
              await getUnapprovedMemesCountQuery.fetchQuery(queryClient, {
                address: ownerId,
                chatId: rootPostId ?? '',
              })
            }
          }
          if (isCurrentOwner) {
            // reset timer because its unapproved meme
            getTimeLeftUntilCanPostQuery.setQueryData(queryClient, myAddress, 0)
            lastSentMessageStorage.remove()

            const count = getUnapprovedMemesCountQuery.getQueryData(
              queryClient,
              { address: myAddress, chatId: rootPostId ?? '' }
            )
            if (count.unapproved === 1 || count.unapproved === 3) {
              useMessageData.getState().setOpenMessageModal('on-review')
            } else {
              const remaining = Math.max(
                MIN_MEME_FOR_REVIEW - (count.unapproved ?? 0),
                0
              )
              const title = 'Under review'
              const description =
                remaining > 0
                  ? `${
                      tokenomics.socialActionPrice.createCommentPoints
                    } points have been used. We received your meme! We need at least ${remaining} more meme${
                      remaining > 1 ? 's' : ''
                    } from you to mark you as a verified creator.`
                  : `${
                      tokenomics.socialActionPrice.createCommentPoints
                    } points have been used. We received ${
                      count ?? 0
                    } memes from you! Now we need a bit of time to finish review you as a verified creator.`
              toast.custom((t) => (
                <Toast
                  t={t}
                  icon={(className) => (
                    <span className={cx(className, 'text-base')}>⏳</span>
                  )}
                  title={title}
                  description={description}
                />
              ))
            }
          }
        }
      }
    }
  }

  if (!rootPostId) return

  const isApproved = entity.approvedInRootPost
  if (isCreationEvent && !isApproved && isCurrentOwner) {
    getPaginatedPostIdsByPostId.setQueryFirstPageData(
      queryClient,
      {
        postId: rootPostId,
        onlyDisplayUnapprovedMessages: false,
        myAddress: getMyMainAddress() ?? '',
      },
      (oldData) => {
        if (!oldData) return [newestId]
        const oldIdsSet = new Set(oldData)
        if (oldIdsSet.has(newestId)) return oldData

        const newIds = [...oldData]
        const index = oldData.findIndex((id) => {
          const data = getPostQuery.getQueryData(queryClient, id)
          if (!data) return false
          if (data.struct.createdAtTime <= eventData.entity.createdAtTime) {
            newIds.unshift(newestId)
            return true
          }
          return false
        })
        if (index !== -1 || oldData.length <= 0) {
          newIds.splice(index, 0, newestId)
        }

        return newIds
      }
    )
  }

  if (isApproved) {
    getPaginatedPostIdsByPostId.setQueryFirstPageData(
      queryClient,
      {
        postId: rootPostId,
        onlyDisplayUnapprovedMessages: !isApproved,
        myAddress: getMyMainAddress() ?? '',
      },
      (oldData) => {
        if (!oldData) return [newestId]
        const oldIdsSet = new Set(oldData)
        if (oldIdsSet.has(newestId)) return oldData

        const newIds = [...oldData]

        const usedAsClientOptimisticId = entity.optimisticId || entity.id
        const clientOptimisticId = commentIdsOptimisticEncoder.encode(
          usedAsClientOptimisticId ?? ''
        )
        if (oldIdsSet.has(clientOptimisticId)) {
          const optimisticIdIndex = newIds.findIndex(
            (id) => id === clientOptimisticId
          )
          newIds.splice(optimisticIdIndex, 1, newestId)
          return newIds
        }

        if (entity.persistentId && oldIdsSet.has(entity.id)) {
          const optimisticIdIndex = newIds.findIndex((id) => id === entity.id)
          newIds.splice(optimisticIdIndex, 1, newestId)

          return newIds
        }

        const index = oldData.findIndex((id) => {
          const data = getPostQuery.getQueryData(queryClient, id)
          if (!data) return false
          if (
            new Date(data.struct.createdAtTime) <=
            new Date(eventData.entity.createdAtTime)
          ) {
            newIds.unshift(newestId)
            return true
          }
          return false
        })
        if (index !== -1 || oldData.length <= 0) {
          newIds.splice(index, 0, newestId)
        }

        return newIds
      }
    )
  } else {
    getPaginatedPostIdsByPostId.invalidateLastQuery(queryClient, {
      postId: rootPostId,
      onlyDisplayUnapprovedMessages: !isApproved,
      myAddress: getMyMainAddress() ?? '',
    })
  }

  getPostMetadataQuery.invalidate(queryClient, rootPostId)
}
