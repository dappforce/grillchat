import Toast from '@/components/Toast'
import { getChainsInfoQuery } from '@/services/chainsInfo/query'
import { createMutationWrapper } from '@/services/subsocial/utils/mutation'
import { getBalancesQuery } from '@/services/substrateBalances/query'
import { useMyMainAddress } from '@/stores/my-account'
import { useLazySubstrateMutation } from '@/subsocial-query/subsocial/lazyMutation'
import { SubsocialMutationConfig } from '@/subsocial-query/subsocial/types'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

type SubstrateDonationProps = {
  amount: string
  recipient: string
}

type OtherProps = {
  chainName: string
  toWalletActionRequired?: () => void
  toLoading?: () => void
  toDonateForm: () => void
  onSuccessAction?: () => void
  successTitle?: string
  successDescription?: string
}

export function useSubstrateDonation(
  config?: SubsocialMutationConfig<SubstrateDonationProps>,
  otherProps?: OtherProps
) {
  const {
    chainName,
    toWalletActionRequired,
    toDonateForm,
    toLoading,
    onSuccessAction,
    successTitle = 'Donation',
    successDescription = 'Your tokens have been successfully donated.',
  } = otherProps || {}
  const client = useQueryClient()
  const { data: chainInfo } = getChainsInfoQuery.useQuery(chainName || '')
  const address = useMyMainAddress()
  const { wsNode, node } = chainInfo || {}

  return useLazySubstrateMutation<SubstrateDonationProps>(
    {
      walletType: 'dynamic',
      chainEndpoint: wsNode || node || '',
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
    config,
    {
      txCallbacks: {
        onSuccess: () => {
          getBalancesQuery.invalidate(client, {
            address: address || '',
            chainName: chainName || '',
          })
          onSuccessAction?.()

          toast.custom((t) => (
            <Toast
              t={t}
              title={successTitle}
              description={successDescription}
              type='default'
            />
          ))
        },
        onBroadcast: () => {
          toLoading?.()
        },
        onStart: () => {
          toWalletActionRequired?.()
        },
        onError: (_data, error) => {
          toDonateForm?.()
          toast.custom((t) => <Toast t={t} title={error} type='error' />)
        },
      },
    }
  )
}

export const SubstrateDonationWrapper = createMutationWrapper(
  useSubstrateDonation,
  'Failed to donate',
  true
)
