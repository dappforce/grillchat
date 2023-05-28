import Button, { ButtonProps } from '@/components/Button'
import { useMyAccount } from '@/stores/my-account'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

type CustomConnectButtonProps = ButtonProps & {
  className?: string
  label?: React.ReactNode
  signAndLinkOnConnect?: boolean
  signAndLinkEvmAddress: (
    emvAddress?: string,
    substrateAddress?: string | null
  ) => Promise<void>
  isSigningMessage: boolean
}

export const CustomConnectButton = ({
  className,
  signAndLinkEvmAddress,
  label = 'Connect EVM Wallet',
  isSigningMessage,
  signAndLinkOnConnect = true,
  ...buttonProps
}: CustomConnectButtonProps) => {
  const mySubstrateAddress = useMyAccount((state) => state.address)
  const { isConnected } = useAccount({
    onConnect: async ({ address }) => {
      !isConnected && signAndLinkOnConnect && signAndLinkEvmAddress(address, mySubstrateAddress)
    },
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
              {...buttonProps}
            >
              {label}
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
              {...buttonProps}
            >
              Wrong network
            </Button>
          )
        }

        return (
          <Button
            onClick={async () => {
              signAndLinkEvmAddress(account.address, mySubstrateAddress)
            }}
            size={'lg'}
            className={className}
            disabled={isSigningMessage}
            {...buttonProps}
          >
            {label}
          </Button>
        )
      }}
    </ConnectButton.Custom>
  )
}
