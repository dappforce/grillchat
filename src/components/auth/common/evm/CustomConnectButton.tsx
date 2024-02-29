import LinkingDark from '@/assets/graphics/linking-dark.svg'
import LinkingLight from '@/assets/graphics/linking-light.svg'
import Button, { ButtonProps } from '@/components/Button'
import {
  getConnector,
  openMobileWallet,
} from '@/components/extensions/donate/api/utils'
import useWrapInRef from '@/hooks/useWrapInRef'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { isTouchDevice } from '@/utils/device'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useEffect, useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'

type CustomConnectButtonProps = ButtonProps & {
  className?: string
  label?: React.ReactNode
  secondLabel?: React.ReactNode
  withWalletActionImage?: boolean
  beforeSignEvmAddress?: () => Promise<void>
  signAndLinkEvmAddress: (
    emvAddress?: string,
    substrateAddress?: string | null,
    signerAddress?: string
  ) => Promise<void>
  isLoading: boolean
}

export const CustomConnectButton = ({
  className,
  beforeSignEvmAddress,
  signAndLinkEvmAddress,
  label = 'Connect EVM Wallet',
  withWalletActionImage = true,
  secondLabel,
  isLoading,
  ...buttonProps
}: CustomConnectButtonProps) => {
  const [hasInteractedOnce, setHasInteractedOnce] = useState(false)

  const mySubstrateAddress = useMyMainAddress()
  const mySubstrateAddressRef = useWrapInRef(mySubstrateAddress)
  const signerAddress = useMyAccount((state) => state.address ?? undefined)
  const signerAddressRef = useWrapInRef(signerAddress)

  const { disconnect } = useDisconnect()
  const { data: accountData, isLoading: isAccountDataLoading } =
    getAccountDataQuery.useQuery(mySubstrateAddress || '')

  const { evmAddress: linkedEvmAddress } = accountData || {}

  const linkEvmAddress = async (address: string) => {
    await beforeSignEvmAddress?.()
    signAndLinkEvmAddress(
      address,
      mySubstrateAddressRef.current,
      signerAddressRef.current
    )
  }

  const { isConnecting } = useAccount()

  const commonButtonProps: ButtonProps = {
    size: 'lg',
    className: className,
    isLoading: isLoading || isConnecting,
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
              linkEvmAddress(account.address)
            }}
          >
            {usedLabel}
          </Button>
        )
      }}
    </ConnectButton.Custom>
  )

  if (withWalletActionImage) {
    return (
      <div className='flex w-full flex-col items-center gap-4'>
        <div className='mb-2 w-full'>
          <LinkingLight className='block w-full dark:hidden' />
          <LinkingDark className='hidden w-full dark:block' />
        </div>

        {customButton}
      </div>
    )
  }

  return customButton
}
