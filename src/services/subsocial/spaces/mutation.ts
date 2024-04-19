import useWaitHasEnergy from '@/hooks/useWaitHasEnergy'
import { useSubsocialMutation } from '@/subsocial-query/subsocial/mutation'
import { SubsocialMutationConfig } from '@/subsocial-query/subsocial/types'
import { useQueryClient } from '@tanstack/react-query'
import { getCurrentWallet } from '../hooks'
import { createMutationWrapper } from '../utils/mutation'
import { getSpaceQuery } from './query'

export type UpdateSpaceParams = {
  spaceId: string
  updatedSpaceContent: any
}
export function useUpdateSpace(
  config?: SubsocialMutationConfig<UpdateSpaceParams>
) {
  const client = useQueryClient()
  const waitHasEnergy = useWaitHasEnergy()

  return useSubsocialMutation<UpdateSpaceParams>(
    {
      getWallet: getCurrentWallet,
      generateContext: undefined,
      transactionGenerator: async ({
        data: { spaceId, updatedSpaceContent },
        apis: { substrateApi },
      }) => {
        console.log('waiting energy...')
        await waitHasEnergy()

        return {
          tx: substrateApi.tx.spaces.updateSpace(spaceId, updatedSpaceContent),
          summary: 'Updating space...',
        }
      },
    },
    config,
    {
      txCallbacks: {
        onSuccess: ({ data }) => {
          const spaceId = data.spaceId

          getSpaceQuery.invalidate(client, spaceId)
        },
      },
    }
  )
}
export const UpdateSpaceWrapper = createMutationWrapper(
  useUpdateSpace,
  'Failed to update space'
)
