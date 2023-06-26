import { useMyAccount } from '@/stores/my-account'
import { u8aToHex } from '@polkadot/util'

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

    return u8aToHex(signer.sign(message))
  }
}
