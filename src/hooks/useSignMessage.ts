import { useMyAccount } from '@/stores/my-account'

export default function useSignMessage() {
  const myAddress = useMyAccount((state) => state.address)
  const signer = useMyAccount((state) => state.signer)

  return async function signMessage(message: string) {
    if (!myAddress) {
      throw new Error('No account connected')
    }

    if (!signer) {
      throw new Error('No signer connected')
    }

    return signer.sign(message)
  }
}
