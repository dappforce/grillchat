import Button from '@/components/Button'
import { useMyAccount } from '@/stores/my-account'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useSignEvmLinkMessage } from './utils'

type CustomConnectButtonProps = {
  className?: string
}

export const CustomConnectButton = ({
  className,
}: CustomConnectButtonProps) => {
  const { signEvmLinkMessage, isLoading } = useSignEvmLinkMessage()
  const mySubstrateAddress = useMyAccount((state) => state.address)

  console.log(isLoading)

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
              disabled={isLoading}
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
              disabled={isLoading}
            >
              Wrong network
            </Button>
          )
        }

        return (
          <Button
            onClick={() =>
              signEvmLinkMessage(account.address, mySubstrateAddress)
            }
            size={'lg'}
            className={className}
            disabled={isLoading}
          >
            Connect EVM Wallet
          </Button>
        )
      }}
    </ConnectButton.Custom>
  )
}
