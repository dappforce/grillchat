import Button from '@/components/Button'
import Carousel from '@/components/Carousel'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import Image, { StaticImageData } from 'next/image'

import ChatMonetization from '@/assets/graphics/creators/chat-monetization.png'
import DiamondListItem from '@/assets/graphics/creators/diamond-list-item.svg'
import EngageToEarn from '@/assets/graphics/creators/engage-to-earn.png'
import EstablishYourBrand from '@/assets/graphics/creators/establish-your-brand.png'
import SeamlessAccess from '@/assets/graphics/creators/seamless-access.png'

const subtitleStyles = 'max-w-[80%] text-sm leading-[22px] opacity-80'
const listItemStyles = 'flex items-center gap-3'
const listItemTextStyles =
  'flex flex-col gap-3 text-sm leading-[22px] opacity-80'

const EngageToEarnSubtitle = () => {
  const diamond = <DiamondListItem />

  return (
    <>
      <p className={subtitleStyles}>Lock SUB and get rewards when you:</p>
      <ul className={'mb-4 flex list-none flex-col gap-2 p-0'}>
        <li className={listItemStyles}>
          {diamond} <span className={listItemTextStyles}>Like posts</span>
        </li>
        <li className={listItemStyles}>
          {diamond}{' '}
          <span className={listItemTextStyles}>
            Get engagement or likes on your content
          </span>
        </li>
      </ul>
    </>
  )
}

const SupportCreatorsCard = () => {
  const data = [
    {
      title: 'Engage-To-Earn',
      subtitle: <EngageToEarnSubtitle />,

      imagePath: EngageToEarn,
      learnMoreHref: '/staking',
      buttonLabel: 'Start Earning',
      backgroundColor: '#DFEFFF',
      titleColor: '#4972E9',
    },
    {
      title: 'Chat Monetization',
      subtitle: (
        <p className={subtitleStyles}>
          Join conversations, share your thoughts, and connect with others to
          start earning every time your messages receive likes.
        </p>
      ),
      imagePath: ChatMonetization,
      learnMoreHref: 'https://grillapp.net/c/hot-chats',
      buttonLabel: 'Explore Chats',
      backgroundColor: '#DFFFDF',
      titleColor: '#30AD30',
    },
    {
      title: 'Establish Your Brand',
      subtitle: (
        <p className={subtitleStyles}>
          Secure your username and create your brand identity on Grill to stand
          out, be recognized, and start growing your community.
        </p>
      ),
      imagePath: EstablishYourBrand,
      learnMoreHref: 'https://grillapp.net/dd',
      buttonLabel: 'Register Username',
      backgroundColor: '#ECF1FF',
      titleColor: '#0F172A',
    },
    {
      title: 'Seamless Access',
      subtitle: (
        <p className={subtitleStyles}>
          Save your Grill key or QR code for hassle-free login access to Grill
          across all of your devices.
        </p>
      ),
      imagePath: SeamlessAccess,
      learnMoreHref:
        'https://grillapp.net/@olehmell/lets-use-login-with-grill-key-100229',
      buttonLabel: 'Learn more',
      backgroundColor: '#C0FEF3',
      titleColor: '#1A3D7A',
    },
  ]

  const items = data.map((item, index) => (
    <div
      key={index}
      className='relative flex h-full flex-col overflow-hidden p-4'
      style={{ backgroundColor: item.backgroundColor }}
    >
      <BannerCard {...item} />
      {data.length > 1 && <div className={'py-4'}></div>}
    </div>
  ))

  return (
    <Carousel
      className='relative z-0 overflow-clip rounded-2xl'
      items={items}
      autoplay
      autoplaySpeed={7000}
      pauseOnHover
      dots
    />
  )
}

type BannerCardProps = {
  title: React.ReactNode
  subtitle: React.ReactNode
  imagePath: StaticImageData
  learnMoreHref: string
  buttonLabel: string
  backgroundColor: string
  titleColor: string
  withDots?: boolean
}

export const BannerCard = ({
  title,
  subtitle,
  imagePath,
  learnMoreHref,
  buttonLabel,
  titleColor,
}: BannerCardProps) => {
  const sendEvent = useSendEvent()

  return (
    <>
      <div
        className={
          'relative z-[1] flex h-full flex-col justify-between text-[#64748B]'
        }
      >
        <div className='flex flex-col gap-3'>
          <Image
            height={89}
            width={89}
            alt=''
            src={imagePath}
            className={cx(
              'absolute right-[-25px] top-[-25px] float-right block'
            )}
          />
          <p
            className={cx('max-w-[66%] text-base font-semibold leading-normal')}
            style={{ color: titleColor }}
          >
            {title}
          </p>
          {subtitle}
        </div>
        <Button
          href={learnMoreHref}
          onClick={() =>
            sendEvent('learn_more_banner', {
              value: learnMoreHref,
            })
          }
          variant='whiteOutline'
          className={
            'flex h-9 w-full items-center justify-center bg-white p-0 text-black'
          }
          target='_blank'
        >
          {buttonLabel}
        </Button>
      </div>
    </>
  )
}

export default SupportCreatorsCard
