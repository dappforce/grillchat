import LinkedEvmAddressImage from '@/assets/graphics/linked-evm-address.png'
import Button from '@/components/Button'
import useSignMessageAndLinkEvmAddress from '@/hooks/useSignMessageAndLinkEvmAddress'
import { openNewWindow, twitterShareUrl } from '@/utils/social-share'
import Image from 'next/image'
import { CustomConnectButton } from './CustomConnectButton'

type CommonEVMLoginErrorProps = {
  setModalStep?: () => void
  onError?: () => void
  signAndLinkOnConnect?: boolean
  beforeSignEvmAddress?: () => Promise<void>
  isLoading?: boolean
}

export const CommonEVMLoginErrorContent = ({
  setModalStep,
  onError,
  signAndLinkOnConnect,
  beforeSignEvmAddress,
  isLoading: _isLoading,
}: CommonEVMLoginErrorProps) => {
  const { signAndLinkEvmAddress, isLoading } = useSignMessageAndLinkEvmAddress({
    setModalStep,
    onError,
  })

  return (
    <CustomConnectButton
      isLoading={_isLoading || isLoading}
      signAndLinkOnConnect={signAndLinkOnConnect}
      signAndLinkEvmAddress={signAndLinkEvmAddress}
      beforeSignEvmAddress={beforeSignEvmAddress}
      className='w-full'
      label='Try again'
      secondLabel='Sign Message'
    />
  )
}

export const CommonEvmAddressLinked = () => {
  const twitterUrl = twitterShareUrl(
    'https://grill.chat',
    `I just linked my #EVM wallet to Grill.chat! Now, I can have a consistent identity and take advantage of new features such as interacting with #ERC20, #NFT, and other smart contracts 🥳`,
    { tags: ['Ethereum', 'Grillchat', 'Subsocial'] }
  )

  return (
    <div className='flex flex-col items-center gap-6'>
      <Image
        src={LinkedEvmAddressImage}
        alt=''
        className='w-full max-w-[260px]'
      />
      <Button
        size={'lg'}
        variant='primary'
        onClick={() => openNewWindow(twitterUrl)}
        className='w-full'
      >
        Tweet about it!
      </Button>
    </div>
  )
}
