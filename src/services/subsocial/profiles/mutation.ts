import { invalidateProfileServerCache, saveFile } from '@/services/api/mutation'
import { getProfileQuery } from '@/services/api/query'
import { useTransactionMutation } from '@/subsocial-query/subsocial/mutation'
import { TransactionMutationConfig } from '@/subsocial-query/subsocial/types'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import { SpaceContent } from '@subsocial/api/types'
import { useQueryClient } from '@tanstack/react-query'
import { getCurrentWallet } from '../hooks'
import { createMutationWrapper } from '../utils/mutation'

type CommonParams = {
  content: {
    name?: string
    image?: string
    about?: string
  } & Pick<SpaceContent, 'profileSource'>
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
export function useUpsertProfile(
  config?: TransactionMutationConfig<UpsertProfileParams>
) {
  const client = useQueryClient()

  return useTransactionMutation<UpsertProfileParams>(
    {
      getWallet: getCurrentWallet,
      generateContext: undefined,
      transactionGenerator: async ({ data: params }) => {
        const { content } = params

        const { payload, action } = checkAction(params)
        if (action === 'update' && payload.spaceId === OPTIMISTIC_PROFILE_ID)
          throw new Error(
            'Please wait until we finalized your previous name change'
          )

        const { success, cid } = await saveFile(content)
        if (!success || !cid) throw new Error('Failed to save file')

        // TODO: datahub mutation for profile update
        if (action === 'update') {
        } else if (action === 'create') {
        }

        throw new Error('Invalid params')
      },
    },
    config,
    {
      txCallbacks: {
        onStart: ({ data, address }) => {
          preventWindowUnload()
          getProfileQuery.setQueryData(client, address, (oldData) => {
            const oldProfileSpaceId = oldData?.profileSpace?.id
            const oldProfileContent = oldData?.profileSpace?.content || {}
            return {
              address,
              isUpdated: true,
              profileSpace: {
                id: oldProfileSpaceId
                  ? oldProfileSpaceId
                  : OPTIMISTIC_PROFILE_ID,
                content: {
                  ...oldProfileContent,
                  ...data.content,
                } as SpaceContent,
              },
            }
          })
        },
        onError: async ({ address }) => {
          getProfileQuery.invalidate(client, address)
        },
        onSuccess: async ({ address }) => {
          allowWindowUnload()
          await invalidateProfileServerCache(address)
          // Remove invalidation because the data will be same, and sometimes IPFS errors out, making the profile gone
          // getProfileQuery.invalidate(client, address)
        },
      },
    }
  )
}
export const UpsertProfileWrapper = createMutationWrapper(
  useUpsertProfile,
  'Failed to upsert profile'
)
