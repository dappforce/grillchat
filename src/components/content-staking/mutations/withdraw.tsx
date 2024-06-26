import { getBackerLedgerQuery } from '@/services/contentStaking/backerLedger/query'
import {
  Status,
  createMutationWrapper,
} from '@/services/subsocial/utils/mutation'
import { getBalancesQuery } from '@/services/substrateBalances/query'
import { useSendEvent } from '@/stores/analytics'
import { useSubsocialMutation } from '@/subsocial-query/subsocial/mutation'
import { SubsocialMutationConfig } from '@/subsocial-query/subsocial/types'
import { useQueryClient } from '@tanstack/react-query'

export function useWithdrawTx(config?: SubsocialMutationConfig<{}>) {
  const client = useQueryClient()
  const sendEvent = useSendEvent()

  return useSubsocialMutation(
    {
      walletType: 'dynamic',
      generateContext: undefined,
      transactionGenerator: async ({ apis: { substrateApi } }) => {
        const stakeTx = substrateApi.tx.creatorStaking.withdrawUnstaked()

        return {
          tx: stakeTx,
          summary: 'Withdraw unlocked tokens',
        }
      },
    },
    config,
    {
      txCallbacks: {
        onSuccess: async ({ address, data }) => {
          await getBackerLedgerQuery.invalidate(client, address)
          await getBalancesQuery.invalidate(client, {
            address,
            chainName: 'subsocial',
          })

          sendEvent('cs_withdraw_tokens')
        },
      },
    }
  )
}

type WithdrawTxWrapperProps = {
  children: (params: {
    mutateAsync: ({}) => Promise<string | undefined>
    isLoading: boolean
    status: Status
    loadingText: string | undefined
  }) => JSX.Element
}

const Wrapper = createMutationWrapper(
  useWithdrawTx,
  'Failed to withdraw unlocked tokens. Please try again.'
)
export const WithdrawTxWrapper = ({ children }: WithdrawTxWrapperProps) => {
  return (
    <Wrapper loadingUntilTxSuccess>
      {(props) => {
        return children(props)
      }}
    </Wrapper>
  )
}
