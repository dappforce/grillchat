import useWrapInRef from '@/hooks/useWrapInRef'
import { enableWallet, useMyAccount } from '@/stores/my-account'
import { WalletAccount } from '@talismn/connect-wallets'
import { useEffect, useState } from 'react'

export default function useAccountsFromPreferredWallet(
  onError?: (err: unknown, preferredWallet: string | undefined) => void
) {
  const preferredWallet = useMyAccount((state) => state.preferredWallet)
  const setPreferredWallet = useMyAccount((state) => state.setPreferredWallet)
  const [accounts, setAccounts] = useState<WalletAccount[] | null>(null)
  const onErrorRef = useWrapInRef(onError)
  const isInitialized = useMyAccount.use.isInitialized()

  useEffect(() => {
    if (!isInitialized) return

    const unsub = enableWallet({
      listener: (accounts) => setAccounts(accounts ?? []),
      onError: (err) => {
        setPreferredWallet(null)
        onErrorRef.current?.(err, preferredWallet?.title)
      },
    })
    return () => {
      unsub.then((unsub) => unsub?.())
    }
  }, [preferredWallet, onErrorRef, setPreferredWallet, isInitialized])

  return { accounts, isLoading: accounts === null }
}
