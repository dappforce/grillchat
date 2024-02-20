import { getCurrentWallet } from '@/services/subsocial/hooks'
import { createMutationWrapper } from '@/services/subsocial/utils'
import { useMyAccount } from '@/stores/my-account'
import { useSubsocialMutation } from '@/subsocial-query/subsocial/mutation'
import { SubsocialMutationConfig } from '@/subsocial-query/subsocial/types'
import { useQueryClient } from 'wagmi'

type MutationProps = {
  spaceId: string
  amount?: string
}

export function useLockOrIncreaseTx(
  config?: SubsocialMutationConfig<MutationProps>
) {
  const client = useQueryClient()

  return useSubsocialMutation(
    {
      getWallet: () => getCurrentWallet('injected'),
      generateContext: undefined,
      transactionGenerator: async ({
        data: params,
        apis: { substrateApi },
      }) => {
        const currentGrillAddress = useMyAccount.getState().address
        if (!currentGrillAddress) throw new Error('No address connected')

        const { spaceId, amount } = params

        if (!amount) {
          throw new Error('Amount is required')
        }

        const stakeTx = substrateApi.tx.creatorStaking.stake(spaceId, amount)

        return {
          tx: stakeTx,
          summary: 'Stake or increase stake of tokens',
        }
      },
    },
    config,
    {
      txCallbacks: {
        onSuccess: () => {},
      },
    }
  )
}
export const LockOrIncreaseTxWrapper = createMutationWrapper(
  useLockOrIncreaseTx,
  'Failed to stake or increase the stake tokens. Please try again.',
  true
)
