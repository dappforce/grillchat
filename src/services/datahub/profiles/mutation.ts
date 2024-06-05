import { ApiDatahubSpaceMutationBody } from '@/pages/api/datahub/space'
import { apiInstance } from '@/services/api/utils'
import { getProfileQuery } from '@/services/datahub/profiles/query'
import { updateSpaceData } from '@/services/datahub/spaces/mutation'
import {
  DatahubParams,
  createSignedSocialDataEvent,
} from '@/services/datahub/utils'
import { getMyMainAddress } from '@/stores/my-account'
import { MutationConfig } from '@/subsocial-query'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import { SpaceContent } from '@subsocial/api/types'
import {
  CreateSpaceAsProfileCallParsedArgs,
  socialCallName,
} from '@subsocial/data-hub-sdk'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getCurrentWallet } from '../../subsocial/hooks'
import { createMutationWrapper } from '../../subsocial/utils/mutation'
import { getDeterministicId } from '../posts/mutation'

type CommonParams = {
  content: {
    name?: string
    image?: string
    about?: string
  }
}
export type UpsertProfileParams =
  | (CommonParams & { uuid: string; timestamp: number })
  | (CommonParams & { spaceId: string })
function checkAction(data: UpsertProfileParams) {
  if ('spaceId' in data) {
    return { payload: data, action: 'update' } as const
  }

  return { payload: data, action: 'create' } as const
}
function useUpsertProfileRaw(config?: MutationConfig<UpsertProfileParams>) {
  const client = useQueryClient()

  return useMutation({
    ...config,
    mutationFn: async (params: UpsertProfileParams) => {
      const { content } = params
      const { payload, action } = checkAction(params)

      if (action === 'create') {
        await createProfileData({
          ...getCurrentWallet(),
          uuid: payload.uuid,
          timestamp: payload.timestamp,
          args: {
            content: content as SpaceContent,
          },
        })
      } else {
        await updateSpaceData({
          ...getCurrentWallet(),
          args: {
            content: content as SpaceContent,
            spaceId: payload.spaceId,
          },
        })
      }
    },
    onMutate: async (data) => {
      config?.onMutate?.(data)
      preventWindowUnload()
      const mainAddress = getMyMainAddress() ?? ''

      const { action, payload } = checkAction(data)
      let id: string
      if (action === 'update') id = payload.spaceId
      else
        id = await getDeterministicId({
          uuid: payload.uuid,
          timestamp: payload.timestamp.toString(),
          account: mainAddress,
        })

      getProfileQuery.setQueryData(client, mainAddress, (oldData) => {
        const oldProfileContent = oldData?.profileSpace?.content || {}
        return {
          address: mainAddress,
          isUpdated: true,
          profileSpace: {
            id,
            content: {
              ...oldProfileContent,
              ...data.content,
            } as SpaceContent,
          },
        }
      })
    },
    onError: async (...params) => {
      config?.onError?.(...params)
      const mainAddress = getMyMainAddress() ?? ''
      getProfileQuery.invalidate(client, mainAddress)
    },
    onSuccess: async (...params) => {
      config?.onSuccess?.(...params)
      allowWindowUnload()
    },
  })
}
export const useUpsertProfile = createMutationWrapper(
  useUpsertProfileRaw,
  'Failed to upsert profile'
)

export async function createProfileData(
  params: DatahubParams<{
    cid?: string
    content: SpaceContent
  }>
) {
  const { args } = params
  const { content, cid } = args
  const eventArgs: CreateSpaceAsProfileCallParsedArgs = {
    ipfsSrc: cid,
  }

  const input = createSignedSocialDataEvent(
    socialCallName.create_space_as_profile,
    params,
    eventArgs,
    content
  )

  await apiInstance.post<any, any, ApiDatahubSpaceMutationBody>(
    '/api/datahub/space',
    {
      action: 'create-space',
      payload: input as any,
    }
  )
}
