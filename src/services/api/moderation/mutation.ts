import {
  ApiModerationActionsBody,
  ApiModerationActionsMessageParams,
  ApiModerationActionsMessageResponse,
  ApiModerationActionsResponse,
} from '@/pages/api/moderation/actions'
import { ResourceTypes } from '@/server/moderation/utils'
import { queryClient } from '@/services/provider'
import mutationWrapper from '@/subsocial-query/base'
import axios, { AxiosResponse } from 'axios'
import { revalidateChatPage } from '../mutation'
import { processMessageTpl } from '../utils'
import {
  getBlockedInPostIdDetailedQuery,
  getBlockedResourcesQuery,
  getModeratorQuery,
} from './query'

async function commitModerationAction(data: ApiModerationActionsMessageParams) {
  if (!data) return null

  const res = await axios.get('/api/moderation/actions', { params: data })
  const messageTpl = (res.data as ApiModerationActionsMessageResponse)
    .messageTpl
  if (!messageTpl) throw new Error('Failed to do moderation action')

  const signedMessage = await processMessageTpl(messageTpl)

  const actionRes = await axios.post<
    any,
    AxiosResponse<ApiModerationActionsResponse>,
    ApiModerationActionsBody
  >('/api/moderation/actions', { signedMessage })

  if (!actionRes.data.success) {
    throw new Error(actionRes.data.message)
  }
  return actionRes
}

const onErrorOrSuccess = (variables: ApiModerationActionsMessageParams) => {
  if (variables.action === 'init')
    getModeratorQuery.invalidate(queryClient, variables.address)
  else if (variables.action === 'block' || variables.action === 'unblock') {
    getBlockedResourcesQuery.invalidate(queryClient, {
      postId: variables.ctxPostId,
    })
    getBlockedInPostIdDetailedQuery.invalidate(queryClient, variables.ctxPostId)
  }
}
const optimisticUnblocking = <T>(
  data: Record<ResourceTypes, T[]>,
  resourceIdToUnblock: string,
  getId: (data: T) => string
) => {
  const newData = { ...data }
  newData.address = newData.address.filter(
    (resource) => getId(resource) !== resourceIdToUnblock
  )
  newData.cid = newData.cid.filter(
    (resource) => getId(resource) !== resourceIdToUnblock
  )
  newData.postId = newData.postId.filter(
    (resource) => getId(resource) !== resourceIdToUnblock
  )
  return newData
}
export const useCommitModerationAction = mutationWrapper(
  commitModerationAction,
  {
    onMutate: async (variables) => {
      if (variables.action === 'unblock') {
        getBlockedResourcesQuery.setQueryData(
          queryClient,
          { postId: variables.ctxPostId },
          (oldData) => {
            if (!oldData) return null
            return {
              ...oldData,
              blockedResources: optimisticUnblocking(
                oldData.blockedResources,
                variables.resourceId,
                (id) => id
              ),
            }
          }
        )
        getBlockedInPostIdDetailedQuery.setQueryData(
          queryClient,
          variables.ctxPostId,
          (oldData) => {
            if (!oldData) return null
            return optimisticUnblocking(
              oldData,
              variables.resourceId,
              (data) => data.resourceId
            )
          }
        )
      }
    },
    onError: (_, variables) => {
      onErrorOrSuccess(variables)
    },
    onSuccess: async (_, variables) => {
      onErrorOrSuccess(variables)
      if (variables.action === 'block' || variables.action === 'unblock') {
        try {
          await revalidateChatPage({ chatId: variables.ctxPostId })
        } catch {}
      }
    },
  }
)
