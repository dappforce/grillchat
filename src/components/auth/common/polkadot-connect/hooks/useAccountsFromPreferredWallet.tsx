import Toast from '@/components/Toast'
import useWrapInRef from '@/hooks/useWrapInRef'
import { enableWallet, useMyAccount } from '@/stores/my-account'
import { WalletAccount } from '@talismn/connect-wallets'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

export default function useAccountsFromPreferredWallet(onError?: () => void) {
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
        toast.custom((t) => (
          <Toast
            t={t}
            title={`Failed to get accounts from ${preferredWallet?.title}`}
            description={(err as any)?.message}
          />
        ))
        setPreferredWallet(null)
        onErrorRef.current?.()
      },
    })
    return () => {
      unsub.then((unsub) => unsub?.())
    }
  }, [preferredWallet, onErrorRef, setPreferredWallet, isInitialized])

  return { accounts, isLoading: accounts === null }
}
