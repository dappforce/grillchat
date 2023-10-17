import Button from '@/components/Button'
import { useMyAccount } from '@/stores/my-account'
import { ContentProps } from '../types'

export default function PolkadotConnectContent({
  setCurrentState,
}: ContentProps) {
  const preferredWallet = useMyAccount((state) => state.preferredWallet)

  return (
    <Button
      onClick={() => {
        if (preferredWallet) setCurrentState('polkadot-connect-account')
        else setCurrentState('polkadot-connect-wallet')
      }}
      size='lg'
    >
      Connect Polkadot Wallet
    </Button>
  )
}
