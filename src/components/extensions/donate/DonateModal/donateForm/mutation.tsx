import useAccountsFromPreferredWallet from '@/components/auth/common/polkadot-connect/hooks/useAccountsFromPreferredWallet'
import Toast from '@/components/Toast'
import { getChainsInfoQuery } from '@/services/chainsInfo/query'
import { getCurrentWallet } from '@/services/subsocial/hooks'
import { getBalancesQuery } from '@/services/substrateBalances/query'
import { buildBalancesKey } from '@/services/substrateBalances/utils'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { useLazySubstrateMutation } from '@/subsocial-query/subsocial/lazyMutation'
import { SubsocialMutationConfig } from '@/subsocial-query/subsocial/types'
import { Signer } from '@/utils/account'
import { GenericAccountId } from '@polkadot/types'
import registry from '@subsocial/api/utils/registry'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { DonateModalStep } from '../types'

type SubstrateDonationProps = {
  amount: string
  recipient: string
}

export function useSubstrateDonatoin(
  chainName: string,
  setCurrentStep: (step: DonateModalStep) => void,
  config?: SubsocialMutationConfig<SubstrateDonationProps>
) {
  const client = useQueryClient()
  const { data: chainInfo } = getChainsInfoQuery.useQuery(chainName)
  const { accounts, isLoading } = useAccountsFromPreferredWallet()
  const parentProxyAddress = useMyAccount((state) => state.parentProxyAddress)
  const connectWallet = useMyAccount((state) => state.connectWallet)
  const address = useMyMainAddress()

  const { wsNode, node } = chainInfo || {}

  useEffect(() => {
    if (parentProxyAddress && accounts) {
      const signer = accounts.find(
        (account) =>
          new GenericAccountId(registry, account.address).toString() ===
          new GenericAccountId(registry, parentProxyAddress).toString()
      )?.signer

      if (signer) {
        connectWallet(parentProxyAddress, signer as Signer)
      }
    }
  }, [parentProxyAddress, isLoading])

  return useLazySubstrateMutation<SubstrateDonationProps>(
    {
      getWallet: () =>
        getCurrentWallet(parentProxyAddress ? 'injected' : 'grill'),
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
          getBalancesQuery.invalidate(
            client,
            buildBalancesKey(address || '', chainName)
          )
        },
        onStart: () => {
          setCurrentStep('wallet-action-required')
        },
        onError: (_data, error) => {
          setCurrentStep('donate-form')
          toast.custom((t) => <Toast t={t} title={error} type='error' />)
        },
      },
    }
  )
}
