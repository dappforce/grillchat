import ProcessingHumster from '@/assets/graphics/processing-humster.png'
import Button, { ButtonProps } from '@/components/Button'
import MetamaskDeepLink, {
  isInsideMetamaskBrowser,
} from '@/components/MetamaskDeepLink'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useMyAccount } from '@/stores/my-account'
import { isTouchDevice } from '@/utils/device'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'

type CustomConnectButtonProps = ButtonProps & {
  className?: string
  label?: React.ReactNode
  secondLabel?: React.ReactNode
  withWalletActionImage?: boolean
  signAndLinkOnConnect?: boolean
  signAndLinkEvmAddress: (
    emvAddress?: string,
    substrateAddress?: string | null
  ) => Promise<void>
  isLoading: boolean
}

export const CustomConnectButton = ({
  className,
  signAndLinkEvmAddress,
  label = 'Connect EVM Wallet',
  withWalletActionImage = true,
  secondLabel,
  isLoading,
  signAndLinkOnConnect = true,
  ...buttonProps
}: CustomConnectButtonProps) => {
  const [hasInteractedOnce, setHasInteractedOnce] = useState(false)

  const mySubstrateAddress = useMyAccount((state) => state.address)
  const { disconnect } = useDisconnect()
  const { data: accountData, isLoading: isAccountDataLoading } =
    getAccountDataQuery.useQuery(mySubstrateAddress || '')

  const { evmAddress: linkedEvmAddress } = accountData || {}

  const { isConnected } = useAccount({
    onConnect: async ({ address }) => {
      !isConnected &&
        !isTouchDevice() &&
        signAndLinkOnConnect &&
        signAndLinkEvmAddress(address, mySubstrateAddress)
    },
  })

  const commonButtonProps: ButtonProps = {
    size: 'lg',
    className: className,
    isLoading: isLoading,
    ...buttonProps,
  }

  useEffect(() => {
    if (!linkedEvmAddress && !isAccountDataLoading) {
      disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkedEvmAddress, isAccountDataLoading])

  const usedLabel = (hasInteractedOnce && secondLabel) || label

  if (!isInsideMetamaskBrowser()) {
    return (
      <MetamaskDeepLink {...commonButtonProps}>{usedLabel}</MetamaskDeepLink>
    )
  }

  const customButton = (
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
              onClick={() => {
                setHasInteractedOnce(true)
                openConnectModal()
              }}
              {...commonButtonProps}
            >
              {usedLabel}
            </Button>
          )
        }

        if (chain.unsupported) {
          return (
            <Button
              onClick={() => {
                setHasInteractedOnce(true)
                openChainModal()
              }}
              {...commonButtonProps}
            >
              Wrong network
            </Button>
          )
        }

        return (
          <Button
            onClick={async () => {
              setHasInteractedOnce(true)
              signAndLinkEvmAddress(account.address, mySubstrateAddress)
            }}
            {...commonButtonProps}
          >
            {usedLabel}
          </Button>
        )
      }}
    </ConnectButton.Custom>
  )

  if (hasInteractedOnce && withWalletActionImage) {
    return (
      <div className='flex w-full flex-col items-center gap-4'>
        <Image
          className='w-64 max-w-xs rounded-full'
          priority
          src={ProcessingHumster}
          alt=''
        />

        {customButton}
      </div>
    )
  }

  return customButton
}
