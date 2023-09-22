import ProcessingHumster from '@/assets/graphics/processing-humster.png'
import Button, { ButtonProps } from '@/components/Button'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useMyAccount } from '@/stores/my-account'
import { isTouchDevice } from '@/utils/device'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { getConnector, openMobileWallet } from '../extensions/donate/api/utils'

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
              {...commonButtonProps}
              onClick={(e) => {
                setHasInteractedOnce(true)
                openConnectModal()
                commonButtonProps.onClick?.(e as any)
              }}
            >
              {usedLabel}
            </Button>
          )
        }

        if (chain.unsupported) {
          return (
            <Button
              {...commonButtonProps}
              onClick={(e) => {
                setHasInteractedOnce(true)
                openChainModal()
                commonButtonProps.onClick?.(e as any)
              }}
            >
              Wrong network
            </Button>
          )
        }

        return (
          <Button
            {...commonButtonProps}
            onClick={async () => {
              setHasInteractedOnce(true)
              const connector = getConnector()
              isTouchDevice() && (await openMobileWallet({ connector }))
              signAndLinkEvmAddress(account.address, mySubstrateAddress)
            }}
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
