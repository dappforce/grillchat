import useWaitHasEnergy from '@/hooks/useWaitHasEnergy'
import { invalidateProfileServerCache, saveFile } from '@/services/api/mutation'
import { getProfileQuery } from '@/services/api/query'
import { useSubsocialMutation } from '@/subsocial-query/subsocial/mutation'
import { SubsocialMutationConfig } from '@/subsocial-query/subsocial/types'
import { IpfsWrapper } from '@/utils/ipfs'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import { useQueryClient } from '@tanstack/react-query'
import { useWalletGetter } from '../hooks'
import { createMutationWrapper } from '../utils'

type CommonParams = {
  content: {
    name: string
    image?: string
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
export function useUpsertProfile(
  config?: SubsocialMutationConfig<UpsertProfileParams>
) {
  const client = useQueryClient()
  const getWallet = useWalletGetter()

  const waitHasEnergy = useWaitHasEnergy()

  return useSubsocialMutation<UpsertProfileParams>(
    getWallet,
    async (params, { substrateApi }) => {
      const { content } = params
      console.log('waiting energy...')
      await waitHasEnergy()

      const { payload, action } = checkAction(params)
      if (action === 'update' && payload.spaceId === OPTIMISTIC_PROFILE_ID)
        throw new Error(
          'Please wait until we finalized your previous name change'
        )

      const { success, cid } = await saveFile(content)
      if (!success || !cid) throw new Error('Failed to save file')

      if (action === 'update') {
        return {
          tx: substrateApi.tx.spaces.updateSpace(payload.spaceId, {
            content: IpfsWrapper(cid),
          }),
          summary: 'Updating profile',
        }
      } else if (action === 'create') {
        return {
          tx: substrateApi.tx.profiles.createSpaceAsProfile(IpfsWrapper(cid)),
          summary: 'Creating profile',
        }
      }

      throw new Error('Invalid params')
    },
    config,
    {
      txCallbacks: {
        onStart: ({ data, address }) => {
          preventWindowUnload()
          getProfileQuery.setQueryData(client, address, {
            address,
            profileSpace: {
              id: OPTIMISTIC_PROFILE_ID,
              ...data.content,
            },
          })
        },
        onSend: () => {
          allowWindowUnload()
        },
        onError: async ({ address }) => {
          getProfileQuery.invalidate(client, address)
        },
        onSuccess: async ({ address }) => {
          await invalidateProfileServerCache(address)
          getProfileQuery.invalidate(client, address)
        },
      },
    }
  )
}
export const UpsertProfileWrapper = createMutationWrapper(
  useUpsertProfile,
  'Failed to upsert profile'
)
