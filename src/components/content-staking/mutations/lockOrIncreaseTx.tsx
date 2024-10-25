import { getBackerInfoQuery } from '@/old/services/contentStaking/backerInfo/query'
import { getBackerLedgerQuery } from '@/old/services/contentStaking/backerLedger/query'
import {
  generalEraInfoId,
  getGeneralEraInfoQuery,
} from '@/old/services/contentStaking/generalErainfo/query'
import {
  Status,
  createMutationWrapper,
} from '@/old/services/subsocial/utils/mutation'
import { getBalancesQuery } from '@/old/services/substrateBalances/query'
import { useSubsocialMutation } from '@/old/subsocial-query/subsocial/mutation'
import { SubsocialMutationConfig } from '@/old/subsocial-query/subsocial/types'
import { useSendEvent } from '@/stores/analytics'
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
  const sendEvent = useSendEvent()

  return useSubsocialMutation(
    {
      walletType: 'dynamic',
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
// export const LockOrIncreaseTxWrapper = createMutationWrapper(
//   useLockOrIncreaseTx,
//   'Failed to stake or increase the stake tokens. Please try again.',
//   true
// )

type LockOrIncreaseTxWrapperProps = {
  closeModal: () => void
  children: (params: {
    mutateAsync: (variables: MutationProps) => Promise<string | undefined>
    isLoading: boolean
    status: Status
    loadingText: string | undefined
  }) => JSX.Element
}

const Wrapper = createMutationWrapper(
  useLockOrIncreaseTx,
  'Failed to stake or increase the stake tokens. Please try again.'
)
export const LockOrIncreaseTxWrapper = ({
  closeModal,
  children,
}: LockOrIncreaseTxWrapperProps) => {
  return (
    <Wrapper
      loadingUntilTxSuccess
      config={{
        txCallbacks: {
          onSuccess: () => {
            closeModal()
          },
        },
      }}
    >
      {(props) => {
        return children(props)
      }}
    </Wrapper>
  )
}
