import ProcessingHumster from '@/assets/graphics/processing-humster.png'
import Button, { ButtonProps } from '@/components/Button'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useMyAccount } from '@/stores/my-account'
import { isTouchDevice } from '@/utils/device'
import { useWeb3Modal } from '@web3modal/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useAccount, useDisconnect, useNetwork } from 'wagmi'

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
  const { open } = useWeb3Modal()

  const mySubstrateAddress = useMyAccount((state) => state.address)
  const { chain } = useNetwork()
  const { disconnect } = useDisconnect()
  const { data: accountData, isLoading: isAccountDataLoading } =
    getAccountDataQuery.useQuery(mySubstrateAddress || '')

  const { evmAddress: linkedEvmAddress } = accountData || {}

  const { isConnected, address: evmAddress } = useAccount({
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

  let customButton = (
    <Button
      onClick={async () => {
        setHasInteractedOnce(true)
        signAndLinkEvmAddress(evmAddress, mySubstrateAddress)
      }}
      {...commonButtonProps}
    >
      {usedLabel}
    </Button>
  )

  if (!isConnected) {
    customButton = (
      <Button
        onClick={() => {
          setHasInteractedOnce(true)
          open({ route: 'ConnectWallet' })
        }}
        {...commonButtonProps}
      >
        {usedLabel}
      </Button>
    )
  }

  if (chain?.unsupported) {
    customButton = (
      <Button
        onClick={() => {
          setHasInteractedOnce(true)
          open({ route: 'SelectNetwork' })
        }}
        {...commonButtonProps}
      >
        Wrong network
      </Button>
    )
  }

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
