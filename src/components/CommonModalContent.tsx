import LinkedEvmAddressImage from '@/assets/graphics/linked-evm-address.png'
import { openNewWindow, twitterShareUrl } from '@/utils/social-share'
import Image from 'next/image'
import { useSignMessageAndLinkEvmAddress } from '../hooks/useSignMessageAndLinkEvmAddress'
import Button from './Button'
import { CustomConnectButton } from './login/CustomConnectButton'

type CommonEVMLoginErrorProps = {
  setModalStep?: () => void
  onError?: () => void
  signAndLinkOnConnect?: boolean
}

export const CommonEVMLoginErrorContent = ({
  setModalStep,
  onError,
  signAndLinkOnConnect,
}: CommonEVMLoginErrorProps) => {
  const { signAndLinkEvmAddress, isLoading } = useSignMessageAndLinkEvmAddress({
    setModalStep,
    onError,
  })

  return (
    <CustomConnectButton
      isLoading={isLoading}
      signAndLinkOnConnect={signAndLinkOnConnect}
      signAndLinkEvmAddress={signAndLinkEvmAddress}
      className='w-full'
      label='Try again'
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
