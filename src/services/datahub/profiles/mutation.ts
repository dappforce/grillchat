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

type CommonParams = {
  content: {
    name?: string
    image?: string
    about?: string
  }
}
export type UpsertProfileParams =
  | CommonParams
  | (CommonParams & { spaceId: string })
function checkAction(data: UpsertProfileParams) {
  if ('spaceId' in data && data.spaceId) {
    return { payload: data, action: 'update' } as const
  }

  return { payload: data, action: 'create' } as const
}
const OPTIMISTIC_PROFILE_ID = 'optimistic-id'
function useUpsertProfileRaw(config?: MutationConfig<UpsertProfileParams>) {
  const client = useQueryClient()

  return useMutation({
    ...config,
    mutationFn: async (params: UpsertProfileParams) => {
      const { content } = params

      const { payload, action } = checkAction(params)
      if (action === 'update' && payload.spaceId === OPTIMISTIC_PROFILE_ID)
        throw new Error(
          'Please wait until we finalized your previous name change'
        )

      if (action === 'create') {
        await createProfileData({
          ...getCurrentWallet(),
          args: {
            content: content as SpaceContent,
          },
        })
      } else {
        await updateSpaceData({
          ...getCurrentWallet(),
          args: {
            content: content as SpaceContent,
          },
        })
      }
    },
    onMutate: (data) => {
      preventWindowUnload()
      const mainAddress = getMyMainAddress() ?? ''
      getProfileQuery.setQueryData(client, mainAddress, (oldData) => {
        const oldProfileSpaceId = oldData?.profileSpace?.id
        const oldProfileContent = oldData?.profileSpace?.content || {}
        return {
          address: mainAddress,
          isUpdated: true,
          profileSpace: {
            id: oldProfileSpaceId ? oldProfileSpaceId : OPTIMISTIC_PROFILE_ID,
            content: {
              ...oldProfileContent,
              ...data.content,
            } as SpaceContent,
          },
        }
      })
    },
    onError: async () => {
      const mainAddress = getMyMainAddress() ?? ''
      getProfileQuery.invalidate(client, mainAddress)
    },
    onSuccess: async () => {
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
