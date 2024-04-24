import { saveFile } from '@/services/api/mutation'
import { getProfileQuery } from '@/services/api/query'
import { getMyMainAddress } from '@/stores/my-account'
import { TransactionMutationConfig } from '@/subsocial-query/subsocial/types'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import { SpaceContent } from '@subsocial/api/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createMutationWrapper } from '../utils/mutation'

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
function useUpsertProfileRaw(
  config?: TransactionMutationConfig<UpsertProfileParams>
) {
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

      const { success, cid } = await saveFile(content)
      if (!success || !cid) throw new Error('Failed to save file')
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
      const mainAddress = getMyMainAddress() ?? ''
      // Remove invalidation because the data will be same, and sometimes IPFS errors out, making the profile gone
      // getProfileQuery.invalidate(client, address)
    },
  })
}
export const useUpsertProfile = createMutationWrapper(
  useUpsertProfileRaw,
  'Failed to upsert profile'
)
