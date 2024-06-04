import Airdrop from '@/assets/icons/bottomNavbar/airdrop.svg'
import Friends from '@/assets/icons/bottomNavbar/friends.svg'
import Stats from '@/assets/icons/bottomNavbar/stats.svg'
import Tap from '@/assets/icons/bottomNavbar/tap.svg'
import TopMemes from '@/assets/icons/bottomNavbar/top-memes.svg'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import { useRouter } from 'next/router'
import { IconType } from 'react-icons'
import CustomLink from 'src/components/referral/CustomLink'

export type HomePageView = 'memes' | 'stats' | 'airdrop' | 'friends' | 'tap'

type MobileNavigationProps = {}

type Tab = {
  id: HomePageView
  text: string
  Icon: any
  href: string
  customClassName?: string
}

const tabs: Tab[] = [
  {
    id: 'memes',
    text: 'Memes',
    Icon: TopMemes,
    href: '/tg/memes',
  },
  {
    id: 'friends',
    text: `Friends`,
    Icon: Friends,
    href: '/tg/friends',
  },
  {
    id: 'tap',
    text: 'Tap',
    Icon: Tap,
    href: '/tg',
  },
  {
    id: 'stats',
    text: 'Stats',
    Icon: Stats,
    href: '/tg/stats',
  },
  {
    id: 'airdrop',
    text: `Airdrop`,
    Icon: Airdrop,
    href: '/tg/airdrop',
    customClassName:
      '[&_path]:fill-[linear-gradient(90deg, #FFE26E 100%, #D8A44D 100%)] !text-[#FBDB6A]',
  },
]

const MobileNavigation = ({}: MobileNavigationProps) => {
  return (
    <div className={cx('sticky bottom-0 z-20 mt-auto w-full p-2')}>
      <div className='flex items-center justify-around rounded-[20px] bg-background-light p-1'>
        {tabs.map(({ id, text, Icon, href, customClassName }) => (
          <NavigationItem
            key={id}
            href={href}
            icon={Icon}
            title={text}
            id={id}
            className={customClassName}
          />
        ))}
      </div>
    </div>
  )
}

function NavigationItem({
  icon: Icon,
  title,
  href,
  forceHardNavigation,
  iconClassName,
  className,
  id,
}: {
  icon: IconType
  title: string
  href: string
  forceHardNavigation?: boolean
  iconClassName?: string
  className?: string
  id: string
}) {
  const { pathname } = useRouter()
  const sendEvent = useSendEvent()

  const onButtonClick = () => {
    sendEvent('navbar_clicked', { value: id })
  }

  return (
    <CustomLink
      className={cx(
        'flex h-full w-full flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2',
        '!text-slate-400 [&_path]:fill-slate-400',
        pathname === href && 'bg-slate-900 !text-text [&_path]:fill-text',
        className
      )}
      forceHardNavigation={forceHardNavigation}
      href={href}
      shallow
      onClick={onButtonClick}
    >
      <Icon className={cx('text-xl', iconClassName)} />
      <span className='text-sm font-medium leading-none'>{title}</span>
    </CustomLink>
  )
}

export default MobileNavigation
