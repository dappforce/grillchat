import Button from '@/components/Button'
import { useMyAccount } from '@/stores/my-account'
import { ConnectButton } from '@rainbow-me/rainbowkit'

type CustomConnectButtonProps = {
  className?: string
  signEvmLinkMessage: (emvAddress?: string, substrateAddress?: string | null) => Promise<string | undefined>
  isSigningMessage: boolean
}

export const CustomConnectButton = ({
  className,
  signEvmLinkMessage,
  isSigningMessage
}: CustomConnectButtonProps) => {
  const mySubstrateAddress = useMyAccount((state) => state.address)

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
            <Button
              onClick={openConnectModal}
              size={'lg'}
              className={className}
              disabled={isSigningMessage}
            >
              Connect EVM Wallet
            </Button>
          )
        }

        if (chain.unsupported) {
          return (
            <Button
              onClick={openChainModal}
              size={'lg'}
              className={className}
              disabled={isSigningMessage}
            >
              Wrong network
            </Button>
          )
        }

        return (
          <Button
            onClick={async () =>
              await signEvmLinkMessage(account.address, mySubstrateAddress)
            }
            size={'lg'}
            className={className}
            disabled={isSigningMessage}
          >
            Connect EVM Wallet
          </Button>
        )
      }}
    </ConnectButton.Custom>
  )
}
