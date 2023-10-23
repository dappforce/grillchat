import Toast from '@/components/Toast'
import useWrapInRef from '@/hooks/useWrapInRef'
import { useMyAccount } from '@/stores/my-account'
import { WalletAccount } from '@talismn/connect-wallets'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

export default function useAccountsFromPreferredWallet(onError?: () => void) {
  const preferredWallet = useMyAccount((state) => state.preferredWallet)
  const setPreferredWallet = useMyAccount((state) => state.setPreferredWallet)
  const [accounts, setAccounts] = useState<WalletAccount[] | null>(null)
  const onErrorRef = useWrapInRef(onError)

  useEffect(() => {
    async function enableWallet() {
      if (!preferredWallet) return
      try {
        await preferredWallet.enable('grill.chat')
        const unsub = preferredWallet.subscribeAccounts((accounts) => {
          setAccounts(accounts ?? [])
        })
        return unsub
      } catch (err) {
        toast.custom((t) => (
          <Toast
            t={t}
            title={`Failed to get accounts from ${preferredWallet.title}`}
            description={(err as any)?.message}
          />
        ))
        setPreferredWallet(null)
        onErrorRef.current?.()
      }
    }

    const unsub = enableWallet()
    return () => {
      unsub.then((unsub) => {
        if (typeof unsub === 'function') unsub()
      })
    }
  }, [preferredWallet, onErrorRef, setPreferredWallet])

  return { accounts, isLoading: accounts === null }
}
