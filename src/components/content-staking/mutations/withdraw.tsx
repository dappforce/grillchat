import useConnectWallet from '@/hooks/useConnectWallet'
import { getBackerLedgerQuery } from '@/services/contentStaking/backerLedger/query'
import { getCurrentWallet } from '@/services/subsocial/hooks'
import {
  Status,
  createMutationWrapper,
} from '@/services/subsocial/utils/mutation'
import { getBalancesQuery } from '@/services/substrateBalances/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { useTransactionMutation } from '@/subsocial-query/subsocial/mutation'
import { TransactionMutationConfig } from '@/subsocial-query/subsocial/types'
import { useQueryClient } from '@tanstack/react-query'

export function useWithdrawTx(config?: TransactionMutationConfig<{}>) {
  const client = useQueryClient()
  const parentProxyAddress = useMyAccount((state) => state.parentProxyAddress)
  const sendEvent = useSendEvent()
  useConnectWallet()

  return useTransactionMutation(
    {
      getWallet: () =>
        getCurrentWallet(parentProxyAddress ? 'injected' : 'grill'),
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

export const WithdrawTxWrapper = ({ children }: WithdrawTxWrapperProps) => {
  const parentProxyAddress = useMyAccount((state) => state.parentProxyAddress)

  const Wrapper = createMutationWrapper(
    useWithdrawTx,
    'Failed to withdraw unlocked tokens. Please try again.',
    !!parentProxyAddress
  )

  return (
    <Wrapper loadingUntilTxSuccess>
      {(props) => {
        return children(props)
      }}
    </Wrapper>
  )
}
