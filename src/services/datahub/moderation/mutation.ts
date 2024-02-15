import {
  ApiDatahubModerationBody,
  ApiDatahubModerationResponse,
} from '@/pages/api/datahub/moderation'
import { revalidateChatPage } from '@/services/api/mutation'
import { apiInstance } from '@/services/api/utils'
import { queryClient } from '@/services/provider'
import { useMyAccount } from '@/stores/my-account'
import mutationWrapper from '@/subsocial-query/base'
import { SocialCallDataArgs, socialCallName } from '@subsocial/data-hub-sdk'
import { AxiosResponse } from 'axios'
import Router from 'next/router'
import { DatahubParams, createSignedSocialDataEvent } from '../utils'
import { getModeratorQuery } from './query'

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

  const input = createSignedSocialDataEvent(data.callName, data, data.args)
  const actionRes = await apiInstance.post<
    any,
    AxiosResponse<ApiDatahubModerationResponse>,
    ApiDatahubModerationBody
  >('/api/datahub/moderation', input as any)

  if (!actionRes.data.success) {
    throw new Error(actionRes.data.message)
  }
  return actionRes
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
    onSuccess: (_, variables) => {
      // HOTFIX: there is no event from subscription when the new moderator and org is linked, so we invalidate the query manually
      const completeArgs = augmentModerationActionParams(variables)
      if (completeArgs.callName === 'synth_moderation_init_moderator') {
        setTimeout(() => {
          getModeratorQuery.invalidate(queryClient, completeArgs.address)
        }, 1_000)
      } else if (
        completeArgs.callName === 'synth_moderation_block_resource' ||
        completeArgs.callName === 'synth_moderation_unblock_resource'
      ) {
        revalidateChatPage({ pathname: Router.asPath })
      }
    },
  }
)
