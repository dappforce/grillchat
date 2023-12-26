import useAccountsFromPreferredWallet from '@/components/auth/common/polkadot-connect/hooks/useAccountsFromPreferredWallet'
import { getCurrentWallet } from '@/services/subsocial/hooks'
import { getBalancesQuery } from '@/services/substrateBalances/query'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { useSubsocialMutation } from '@/subsocial-query/subsocial/mutation'
import { SubsocialMutationConfig } from '@/subsocial-query/subsocial/types'
import { Signer } from '@/utils/account'
import { GenericAccountId } from '@polkadot/types'
import registry from '@subsocial/api/utils/registry'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

type SubstrateDonationProps = {
  amount: string
  recipient: string
}

export function useSubstrateDonatoin(
  chainName: string,
  config?: SubsocialMutationConfig<SubstrateDonationProps>
) {
  const client = useQueryClient()
  const { accounts, isLoading } = useAccountsFromPreferredWallet()
  const parentProxyAddress = useMyAccount((state) => state.parentProxyAddress)
  const connectWallet = useMyAccount((state) => state.connectWallet)
  const address = useMyMainAddress()

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

  return useSubsocialMutation<SubstrateDonationProps>(
    {
      getWallet: () =>
        getCurrentWallet(parentProxyAddress ? 'injected' : 'grill'),
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
          getBalancesQuery.invalidate(client, `${address}|${chainName}`)
        },
      },
    }
  )
}
