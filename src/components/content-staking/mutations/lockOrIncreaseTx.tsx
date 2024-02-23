import { getBackerInfoQuery } from '@/services/contentStaking/backerInfo/query'
import { getBackerLedgerQuery } from '@/services/contentStaking/backerLedger/query'
import {
  generalEraInfoId,
  getGeneralEraInfoQuery,
} from '@/services/contentStaking/generalErainfo/query'
import { getCurrentWallet } from '@/services/subsocial/hooks'
import { createMutationWrapper } from '@/services/subsocial/utils'
import { useMyAccount } from '@/stores/my-account'
import { useSubsocialMutation } from '@/subsocial-query/subsocial/mutation'
import { SubsocialMutationConfig } from '@/subsocial-query/subsocial/types'
import { balanceWithDecimal } from '@subsocial/utils'
import { useQueryClient } from '@tanstack/react-query'

type MutationProps = {
  spaceId: string
  amount?: string
  decimal?: number
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

        const { spaceId, amount, decimal } = params

        if (!amount) {
          throw new Error('Amount is required')
        }

        const amountWithDecimals = balanceWithDecimal(amount, decimal || 0)

        const stakeTx = substrateApi.tx.creatorStaking.stake(
          spaceId,
          amountWithDecimals.toString()
        )

        return {
          tx: stakeTx,
          summary: 'Stake or increase stake of tokens',
        }
      },
    },
    config,
    {
      txCallbacks: {
        onSuccess: ({ address, data }) => {
          getBackerLedgerQuery.invalidate(client, address)
          getGeneralEraInfoQuery.invalidate(client, generalEraInfoId)
          getBackerInfoQuery.invalidate(client, {
            account: address,
            spaceIds: [data.spaceId],
          })
        },
      },
    }
  )
}
export const LockOrIncreaseTxWrapper = createMutationWrapper(
  useLockOrIncreaseTx,
  'Failed to stake or increase the stake tokens. Please try again.',
  true
)
