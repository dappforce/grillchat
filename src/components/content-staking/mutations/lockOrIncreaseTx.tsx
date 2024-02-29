import useConnectWallet from '@/hooks/useConnectWallet'
import { getBackerInfoQuery } from '@/services/contentStaking/backerInfo/query'
import { getBackerLedgerQuery } from '@/services/contentStaking/backerLedger/query'
import {
  generalEraInfoId,
  getGeneralEraInfoQuery,
} from '@/services/contentStaking/generalErainfo/query'
import { getCurrentWallet } from '@/services/subsocial/hooks'
import { createMutationWrapper } from '@/services/subsocial/utils'
import { getBalancesQuery } from '@/services/substrateBalances/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { useSubsocialMutation } from '@/subsocial-query/subsocial/mutation'
import { SubsocialMutationConfig } from '@/subsocial-query/subsocial/types'
import { balanceWithDecimal } from '@subsocial/utils'
import { useQueryClient } from '@tanstack/react-query'
import getAmountRange from '../utils/getAmountRangeForAnalytics'

type MutationProps = {
  spaceId: string
  amount?: string
  decimal?: number
}

export function useLockOrIncreaseTx(
  config?: SubsocialMutationConfig<MutationProps>
) {
  const client = useQueryClient()
  const parentProxyAddress = useMyAccount((state) => state.parentProxyAddress)
  const sendEvent = useSendEvent()
  useConnectWallet()

  return useSubsocialMutation(
    {
      getWallet: () =>
        getCurrentWallet(parentProxyAddress ? 'injected' : 'grill'),
      generateContext: undefined,
      transactionGenerator: async ({
        data: params,
        apis: { substrateApi },
      }) => {
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
        onSuccess: async ({ address, data }) => {
          await getBackerLedgerQuery.invalidate(client, address)
          await getGeneralEraInfoQuery.invalidate(client, generalEraInfoId)
          await getBalancesQuery.invalidate(client, {
            address,
            chainName: 'subsocial',
          })
          await getBackerInfoQuery.invalidate(client, {
            account: address,
            spaceIds: [data.spaceId],
          })

          sendEvent('cs_lock', {
            value: data.amount,
            amountRange: getAmountRange(data.amount),
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
