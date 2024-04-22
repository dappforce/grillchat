import useAccountsFromPreferredWallet from '@/components/auth/common/polkadot-connect/hooks/useAccountsFromPreferredWallet'
import { useMyAccount } from '@/stores/my-account'
import { Signer } from '@/utils/account'
import { useEffect } from 'react'

const useConnectWallet = () => {
  const { accounts, isLoading } = useAccountsFromPreferredWallet()
  const parentProxyAddress = useMyAccount((state) => state.parentProxyAddress)
  const connectWallet = useMyAccount((state) => state.connectWallet)

  useEffect(() => {
    if (parentProxyAddress && accounts) {
      const signer = accounts.find((account) => {
        return account.address === parentProxyAddress
      })?.signer

      if (signer) {
        connectWallet(parentProxyAddress, signer as Signer)
      }
    }
  }, [parentProxyAddress, isLoading])
}

export default useConnectWallet
