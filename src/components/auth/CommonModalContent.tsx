import LinkedEvmAddressImage from '@/assets/graphics/linked-evm-address.png'
import ProcessingHumster from '@/assets/graphics/processing-humster.png'
import useSignMessageAndLinkEvmAddress from '@/hooks/useSignMessageAndLinkEvmAddress'
import { isTouchDevice } from '@/utils/device'
import { openMobileWallet } from '@/utils/evm'
import { openNewWindow, twitterShareUrl } from '@/utils/social-share'
import Image from 'next/image'
import Button from '../Button'
import { getConnector } from '../extensions/donate/api/utils'
import { CustomConnectButton } from './CustomConnectButton'

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

  const connectionButton = (
    <CustomConnectButton
      isLoading={isLoading}
      signAndLinkOnConnect={signAndLinkOnConnect}
      signAndLinkEvmAddress={signAndLinkEvmAddress}
      className='w-full'
      label='Try again'
    />
  )

  // TODO: this is hotfix, refactor it along with the other component that uses same UI
  if (isLoading) {
    const onButtonClick = async () => {
      const connector = getConnector()
      await openMobileWallet({ connector })
    }

    return (
      <div className='flex w-full flex-col items-center gap-4'>
        <Image
          className='w-64 max-w-xs rounded-full'
          priority
          src={ProcessingHumster}
          alt=''
        />

        {isTouchDevice() && (
          <Button className='w-full' size={'lg'} onClick={onButtonClick}>
            Open wallet
          </Button>
        )}

        <div className='hidden'>{connectionButton}</div>
      </div>
    )
  }

  return connectionButton
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
