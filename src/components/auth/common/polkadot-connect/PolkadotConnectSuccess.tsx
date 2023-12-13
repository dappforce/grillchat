import LinkedPolkadotAddressImage from '@/assets/graphics/linked-polkadot-address.png'
import Button from '@/components/Button'
import useLoginOption from '@/hooks/useLoginOption'
import { useSendEvent } from '@/stores/analytics'
import { openNewWindow, twitterShareUrl } from '@/utils/social-share'
import Image from 'next/image'

export default function PolkadotConnectSuccess() {
  const sendEvent = useSendEvent()
  const { loginOption } = useLoginOption()

  const twitterGeneralUrl = twitterShareUrl(
    'https://grill.chat',
    `I just linked my #Polkadot wallet to Grill.chat! Now, I can have a consistent identity 🥳`,
    { tags: ['Polkadot', 'Grillchat', 'Subsocial'] }
  )
  const twitterStakersUrl = twitterShareUrl(
    'https://grill.chat/creators/stakers-20132',
    `I just joined the Active Stakers chat on Grill Chat to prepare for the next upgrade to @SubsocialChain's Creator Staking system!

Stake some #SUB, connect to Grill.chat with your staker account, enable notifications, and join the chat!
`,
    { tags: ['Polkadot', 'Grillchat', 'Subsocial'] }
  )

  const twitterUrl =
    loginOption === 'polkadot' ? twitterStakersUrl : twitterGeneralUrl

  return (
    <div className='flex flex-col items-center gap-6'>
      <Image
        src={LinkedPolkadotAddressImage}
        alt=''
        className='w-full max-w-[260px]'
      />
      <Button
        size={'lg'}
        variant='primary'
        onClick={() => {
          openNewWindow(twitterUrl)
          sendEvent('post_on_x')
        }}
        className='w-full'
      >
        Post about it on X!
      </Button>
    </div>
  )
}
