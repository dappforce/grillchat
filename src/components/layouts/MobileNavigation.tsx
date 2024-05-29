import Account from '@/assets/graphics/account.svg'
import Stats from '@/assets/graphics/stats.svg'
import TopMemes from '@/assets/graphics/top-memes.svg'
import { cx } from '@/utils/class-names'
import { useRouter } from 'next/router'
import { IconType } from 'react-icons'
import CustomLink from 'src/components/referral/CustomLink'

export type HomePageView = 'memes' | 'stats' | 'airdrop' | 'friends' | 'tap'

type MobileNavigationProps = {}

type Tab = { id: HomePageView; text: string; Icon: any; href: string }

const tabs: Tab[] = [
  {
    id: 'memes',
    text: 'Memes',
    Icon: TopMemes,
    href: '/memes/tg/memes',
  },
  {
    id: 'friends',
    text: `Friends`,
    Icon: Stats,
    href: '/memes/tg/friends',
  },
  {
    id: 'tap',
    text: 'Tap',
    Icon: Account,
    href: '/memes/tg',
  },
  {
    id: 'stats',
    text: 'Stats',
    Icon: Stats,
    href: '/memes/tg/stats',
  },
  {
    id: 'airdrop',
    text: `Airdrop`,
    Icon: Stats,
    href: '/memes/tg/airdrop',
  },
]

const MobileNavigation = ({}: MobileNavigationProps) => {
  return (
    <div className={cx('sticky bottom-0 z-10 mt-auto w-full p-3')}>
      <div className='flex items-center justify-around rounded-[20px] bg-background-light p-2'>
        {tabs.map(({ id, text, Icon, href }) => (
          <NavigationItem key={id} href={href} icon={Icon} title={text} />
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
}: {
  icon: IconType
  title: string
  href: string
  forceHardNavigation?: boolean
  iconClassName?: string
}) {
  const { pathname } = useRouter()

  return (
    <CustomLink
      className={cx(
        'flex h-full w-full flex-col items-center justify-center gap-2 rounded-2xl px-1 py-2',
        '!text-slate-400 [&_path]:fill-slate-400',
        pathname === href && 'bg-slate-900 !text-text [&_path]:fill-text'
      )}
      forceHardNavigation={forceHardNavigation}
      href={href}
      shallow
    >
      <Icon className={cx('text-xl', iconClassName)} />
      <span className='text-sm font-medium leading-none'>{title}</span>
    </CustomLink>
  )
}

export default MobileNavigation
