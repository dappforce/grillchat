import {
  ApiModerationActionsBody,
  ApiModerationActionsResponse,
} from '@/pages/api/moderation/actions'
import { revalidateChatPage } from '@/services/api/mutation'
import { queryClient } from '@/services/provider'
import {
  getBlockedInPostIdDetailedQuery,
  getBlockedResourcesQuery,
  getModeratorQuery,
} from '@/services/subsocial/datahub/moderation/query'
import { ResourceTypes } from '@/services/subsocial/datahub/moderation/utils'
import { getPostMetadataQuery } from '@/services/subsocial/datahub/posts/query'
import { useMyAccount } from '@/stores/my-account'
import mutationWrapper from '@/subsocial-query/base'
import { getDatahubConfig } from '@/utils/env/client'
import { SocialCallDataArgs, socialCallName } from '@subsocial/data-hub-sdk'
import axios, { AxiosResponse } from 'axios'
import { createSocialDataEventInput, DatahubParams } from '../utils'

type ModerationCallNames =
  | (typeof socialCallName)['synth_moderation_init_moderator']
  | (typeof socialCallName)['synth_moderation_add_ctx_to_organization']
  | (typeof socialCallName)['synth_moderation_block_resource']
  | (typeof socialCallName)['synth_moderation_unblock_resource']
type ModerationActionsParams<T extends ModerationCallNames> = DatahubParams<
  SocialCallDataArgs<T>
> & { callName: T }
async function moderationActions<T extends ModerationCallNames>(
  data: ModerationActionsParams<T>
) {
  if (!data) return null

  const input = createSocialDataEventInput(data.callName, data, data.args)
  const actionRes = await axios.post<
    any,
    AxiosResponse<ApiModerationActionsResponse>,
    ApiModerationActionsBody
  >('/api/moderation/actions', input as any)

  if (!actionRes.data.success) {
    throw new Error(actionRes.data.message)
  }
  return actionRes
}

const onErrorOrSuccess = <T extends ModerationCallNames>(
  variables: ModerationActionsParams<T>
) => {
  if (variables.callName === 'synth_moderation_init_moderator')
    getModeratorQuery.invalidate(queryClient, variables.address)
  else if (
    variables.callName === 'synth_moderation_block_resource' ||
    variables.callName === 'synth_moderation_unblock_resource'
  ) {
    const args = variables.args as SocialCallDataArgs<
      'synth_moderation_block_resource' | 'synth_moderation_unblock_resource'
    >
    args.ctxPostIds?.forEach((id) => {
      getBlockedResourcesQuery.invalidate(queryClient, {
        postId: id,
      })
      getBlockedInPostIdDetailedQuery.invalidate(queryClient, id)
    })
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

type SimplifiedModerationActionParams<T extends ModerationCallNames> = Omit<
  ModerationActionsParams<T>,
  'signer' | 'isOffchain' | 'proxyToAddress' | 'address'
>
function augmentModerationActionParams<T extends ModerationCallNames>(
  simplifiedParams: SimplifiedModerationActionParams<T>
) {
  const { signer, address, parentProxyAddress } = useMyAccount.getState()
  if (!address) throw new Error('You have to connect wallet first')
  return {
    ...simplifiedParams,
    signer,
    isOffchain: true,
    address,
    proxyToAddress: parentProxyAddress,
  }
}
export const useModerationActions = mutationWrapper(
  <T extends ModerationCallNames>(
    data: SimplifiedModerationActionParams<T>
  ) => {
    return moderationActions(augmentModerationActionParams(data))
  },
  {
    onMutate: async (variables) => {
      if (variables.callName === 'synth_moderation_unblock_resource') {
        const args =
          variables.args as SocialCallDataArgs<'synth_moderation_unblock_resource'>
        args.ctxPostIds?.forEach((id) => {
          getBlockedResourcesQuery.setQueryData(
            queryClient,
            { postId: id },
            (oldData) => {
              if (!oldData) return null
              return {
                ...oldData,
                blockedResources: optimisticUnblocking(
                  oldData.blockedResources,
                  args.resourceId,
                  (id) => id
                ),
              }
            }
          )
          getBlockedInPostIdDetailedQuery.setQueryData(
            queryClient,
            id,
            (oldData) => {
              if (!oldData) return null
              return optimisticUnblocking(
                oldData,
                args.resourceId,
                (data) => data.resourceId
              )
            }
          )
        })
      }
    },
    onError: (_, variables) => {
      onErrorOrSuccess(augmentModerationActionParams(variables))
    },
    onSuccess: async (_, variables) => {
      onErrorOrSuccess(augmentModerationActionParams(variables))
      if (
        variables.callName === 'synth_moderation_block_resource' ||
        variables.callName === 'synth_moderation_unblock_resource'
      ) {
        const args = variables.args as SocialCallDataArgs<
          | 'synth_moderation_block_resource'
          | 'synth_moderation_unblock_resource'
        >
        args.ctxPostIds?.forEach((id) => {
          try {
            revalidateChatPage({ chatId: id })
          } catch {}

          if (getDatahubConfig()) {
            getPostMetadataQuery.setQueryData(queryClient, id, (oldData) => {
              if (!oldData) return oldData
              let change = 1
              if (variables.callName === 'synth_moderation_block_resource')
                change = -1
              return {
                ...oldData,
                totalCommentsCount: oldData.totalCommentsCount + change,
              }
            })
          }
        })
      }
    },
  }
)
