import Button from '@/components/Button'
import { useMyAccount } from '@/stores/my-account'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useLinkEvmAccount } from './linkEvmAccountHook'

type CustomConnectButtonProps = {
  className?: string
  signEvmLinkMessage: (
    emvAddress?: string,
    substrateAddress?: string | null
  ) => Promise<string | undefined>
  isSigningMessage: boolean
}

export const CustomConnectButton = ({
  className,
  signEvmLinkMessage,
  isSigningMessage,
}: CustomConnectButtonProps) => {
  const mySubstrateAddress = useMyAccount((state) => state.address)
  useAccount({
    onConnect: async ({ address }) => {
      const data = await signEvmLinkMessage(address, mySubstrateAddress)

      if (data) {
        linkEvmAccount({
          evmAccount: address as string,
          evmSignature: data,
        })
      }
    },
  })
  const { mutate: linkEvmAccount } = useLinkEvmAccount()

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
            onClick={async () => {
              const data = await signEvmLinkMessage(
                account.address,
                mySubstrateAddress
              )

              if (data) {
                linkEvmAccount({
                  evmAccount: account.address,
                  evmSignature: data,
                })
              }
            }}
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
