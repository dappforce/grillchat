import Button from '@/components/Button'
import { useMyAccount } from '@/stores/my-account'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

type CustomConnectButtonProps = {
  className?: string
  signAndLinkEvmAddress: (
    emvAddress?: string,
    substrateAddress?: string | null
  ) => Promise<void>
  isSigningMessage: boolean
}

export const CustomConnectButton = ({
  className,
  signAndLinkEvmAddress,
  isSigningMessage,
}: CustomConnectButtonProps) => {
  const mySubstrateAddress = useMyAccount((state) => state.address)
  useAccount({
    onConnect: async ({ address }) =>
      signAndLinkEvmAddress(address, mySubstrateAddress),
  })

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
              signAndLinkEvmAddress(account.address, mySubstrateAddress)
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
