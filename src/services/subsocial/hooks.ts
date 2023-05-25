import { useMyAccount } from '@/stores/my-account'

export function useWalletGetter() {
  const address = useMyAccount((state) => state.address ?? '')
  const signer = useMyAccount((state) => state.signer)

  return async () => ({ address, signer })
}
