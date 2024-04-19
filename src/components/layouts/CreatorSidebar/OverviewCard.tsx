import ChatMonetization from '@/assets/graphics/creators/chat-monetization.png'
import DiamondSmall from '@/assets/graphics/creators/diamonds/diamond-small.svg'
import EngageToEarn from '@/assets/graphics/creators/engage-to-earn.png'
import EstablishBrand from '@/assets/graphics/creators/establish-your-brand.png'
import SeamlessAccess from '@/assets/graphics/creators/seamless-access.png'
import SubsocialTokens from '@/assets/graphics/creators/subsocial-tokens.png'
import Button, { buttonStyles } from '@/components/Button'
import LinkText from '@/components/LinkText'
import Carousel from '@/components/carousel/Carousel'
import { getTotalStakeQuery } from '@/services/datahub/content-staking/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { BN } from '@polkadot/util'
import Image, { ImageProps } from 'next/image'
import { ReactNode } from 'react'

export default function OverviewCard() {
  const myAddress = useMyMainAddress()
  const { data: totalStake } = getTotalStakeQuery.useQuery(myAddress ?? '')

  const { amount } = totalStake || {}

  const isStaked = !new BN(amount || '0').isZero()

  return isStaked ? <StakedCard /> : <NotStakedCard />
}

function StakedCard() {
  return (
    <div className='relative overflow-clip rounded-2xl'>
      <Carousel
        slides={[
          <StakedSlide
            key='engage-to-earn'
            title='Engage-To-Earn'
            subtitle={<EngageToEarnSubtitle />}
            buttonText='Start Earning'
            buttonHref='/staking'
            image={EngageToEarn}
            className='bg-[#DFEFFF] text-[#4972E9]'
          />,
          <StakedSlide
            key='chat-monetization'
            title='Chat Monetization'
            subtitle='Join conversations, share your thoughts, and connect with others to start earning every time your messages receive likes.'
            buttonText='Explore Chats'
            buttonHref='/'
            image={ChatMonetization}
            className='bg-[#DFFFDF] text-[#30AD30]'
          />,
          <StakedSlide
            key='establish-your-brand'
            title='Establish Your Brand'
            subtitle='Secure your username and create your brand identity on Grill to stand out, be recognized, and start growing your community.'
            buttonText='Register Username'
            buttonHref='/dd'
            forceHardNavigation
            image={EstablishBrand}
            className='bg-[#ECF1FF] text-[#0F172A]'
          />,
          <StakedSlide
            key='seamless-access'
            title='Seamless Access'
            subtitle='Save your Grill key or QR code for hassle-free login access to Grill across all of your
            devices.'
            buttonText='Learn more'
            forceHardNavigation
            buttonHref='https://grillapp.net/@olehmell/lets-use-login-with-grill-key-100229'
            image={SeamlessAccess}
            className='bg-[#C0FEF3] text-[#1A3D7A]'
          />,
        ]}
      />
    </div>
  )
}

function StakedSlide({
  buttonHref,
  buttonText,
  image,
  subtitle,
  title,
  className,
  forceHardNavigation,
}: {
  title: string
  subtitle: ReactNode
  image: ImageProps['src']
  buttonText: string
  buttonHref: string
  className?: string
  forceHardNavigation?: boolean
}) {
  return (
    <div className={cx('relative flex h-full flex-col p-4 pb-12', className)}>
      <Image src={image} alt='' className='absolute -right-3 -top-3 w-24' />
      <span className={cx('mb-2 max-w-[78%] font-semibold')}>{title}</span>
      <div className='mb-6 max-w-[78%] text-sm text-text-muted'>{subtitle}</div>
      <LinkText
        href={buttonHref}
        forceHardNavigation={forceHardNavigation}
        className={cx(
          'mt-auto text-center text-sm font-medium !no-underline',
          buttonStyles({ variant: 'white' })
        )}
      >
        {buttonText}
      </LinkText>
    </div>
  )
}

function EngageToEarnSubtitle() {
  return (
    <>
      <p className={cx('mb-3')}>Lock SUB and get rewards when you:</p>
      <ul className={cx('flex flex-col gap-2')}>
        <li className='flex items-start gap-2'>
          <DiamondSmall className='relative top-1 flex-shrink-0' />{' '}
          <span>Like posts</span>
        </li>
        <li className='flex items-start gap-2'>
          <DiamondSmall className='relative top-1 flex-shrink-0' />
          <span>Get engagement or likes on your content</span>
        </li>
      </ul>
    </>
  )
}

function NotStakedCard() {
  const sendEvent = useSendEvent()

  return (
    <div
      className={cx('relative z-0 overflow-clip rounded-2xl bg-[#2D81FF] p-4')}
    >
      <div className={cx('relative z-10 text-white')}>
        <Image
          src={SubsocialTokens}
          alt=''
          className='relative float-right -mr-6 -mt-6 block w-[115px]'
        />
        <p className={cx('mb-3 text-lg font-semibold')}>
          How To Earn SUB On The Grill
        </p>
        <p className={cx('mb-3 text-sm opacity-80')}>
          Lock SUB tokens and get rewards when
        </p>
        <ul className={cx('flex flex-col gap-2 text-sm opacity-80')}>
          <li className={cx('flex items-start gap-2')}>
            <DiamondSmall className='relative top-1 flex-shrink-0' />
            <span>You like</span>
          </li>
          <li className={cx('flex items-start gap-2')}>
            <DiamondSmall className='relative top-1 flex-shrink-0' />
            <span>You receive likes on posts, comments or messages</span>
          </li>
          <li className={cx('flex items-start gap-2')}>
            <DiamondSmall className='relative top-1 flex-shrink-0' />
            <span>Comments under your posts receive likes</span>
          </li>
        </ul>
        <Button
          href='/staking'
          className='mt-6 w-full text-sm font-medium'
          variant='white'
          onClick={() =>
            sendEvent('astake_banner_add_stake', {
              eventSource: 'support-creators-banner',
            })
          }
        >
          Lock SUB
        </Button>
      </div>

      <div className='absolute left-1/2 top-0 h-[1000px] w-[1000px] rounded-full bg-[#A897FA] blur-[300px]' />
      <div className='absolute -top-1/2 left-0 h-[300px] w-[300px] rounded-full bg-[#c6c1fcb0] blur-[135px]' />
    </div>
  )
}
