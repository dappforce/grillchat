import { getCurrentWallet } from '@/services/subsocial/hooks'
import { useSubsocialMutation } from '@/subsocial-query/subsocial/mutation'
import { SubsocialMutationConfig } from '@/subsocial-query/subsocial/types'

type SubstrateDonationProps = {
  amount: string
  recipient: string
}

export function useSubstrateDonatoin(
  config?: SubsocialMutationConfig<SubstrateDonationProps>
) {
  return useSubsocialMutation<SubstrateDonationProps>(
    {
      getWallet: getCurrentWallet,
      generateContext: undefined,
      transactionGenerator: async ({
        data: { amount, recipient },
        apis: { substrateApi },
      }) => {
        return {
          tx: substrateApi.tx.balances.transfer({ Id: recipient }, amount),
          summary: 'Transfer',
        }
      },
    },
    config
  )
}
