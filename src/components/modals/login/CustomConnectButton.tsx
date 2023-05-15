import Button from '@/components/Button'
import { ConnectButton } from '@rainbow-me/rainbowkit'

type CustomConnectButtonProps = {
  className?: string
}

export const CustomConnectButton = ({ className }: CustomConnectButtonProps) => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated')

        if (!connected) {
          return (
            <Button onClick={openConnectModal} size={'lg'} className={className} >
              Connect EVM Wallet
            </Button>
          )
        }

        if (chain.unsupported) {
          return (
            <button onClick={openChainModal} type='button'>
              Wrong network
            </button>
          )
        }
      }}
    </ConnectButton.Custom>
  )
}
