import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { useRouter } from 'next/router'
import { IconType } from 'react-icons'
import { BiChat, BiNews } from 'react-icons/bi'
import { LuCompass } from 'react-icons/lu'
import { MdOutlineLeaderboard } from 'react-icons/md'
import { RiLineChartLine } from 'react-icons/ri'
import { TbCoins, TbWorld } from 'react-icons/tb'
import { TiFlashOutline } from 'react-icons/ti'
import CustomLink from '../referral/CustomLink'

export default function Sidebar() {
  const myAddress = useMyMainAddress()

  return (
    <aside className='flex flex-col p-4 pl-0 text-text-muted/80'>
      <ul className='flex flex-col gap-4'>
        <SidebarItem icon={BiNews} title='Feed' href='/' forceHardNavigation />
        <SidebarItem icon={BiChat} title='Chat' href='/' />
        {myAddress && (
          <SidebarItem
            icon={LuCompass}
            title='My Spaces'
            href={`/accounts/${myAddress}/spaces`}
            forceHardNavigation
          />
        )}

        <div className='border-t border-border-gray' />

        <SidebarItem icon={TbCoins} title='Content Staking' href='/staking' />
        <SidebarItem
          icon={MdOutlineLeaderboard}
          title='Leaderboard'
          href='/leaderboard'
          forceHardNavigation
        />
        <SidebarItem
          icon={RiLineChartLine}
          title='Statistics'
          href='/stats'
          forceHardNavigation
        />

        <div className='border-t border-border-gray' />

        <SidebarItem
          icon={TbWorld}
          title='Usernames'
          href='/dd'
          forceHardNavigation
        />
        <SidebarItem
          icon={TiFlashOutline}
          title='Energy Station'
          href='/energy'
          forceHardNavigation
        />
      </ul>
    </aside>
  )
}

function SidebarItem({
  icon: Icon,
  title,
  href,
  forceHardNavigation,
}: {
  icon: IconType
  title: string
  href: string
  forceHardNavigation?: boolean
}) {
  const { pathname } = useRouter()
  return (
    <li>
      <CustomLink
        className={cx(
          'flex items-center gap-4 transition hover:text-text-primary focus-visible:text-text-primary',
          pathname === href && !forceHardNavigation && 'text-text-primary'
        )}
        forceHardNavigation={forceHardNavigation}
        href={href}
      >
        <Icon className='text-xl' />
        <span className='text-sm font-medium'>{title}</span>
      </CustomLink>
    </li>
  )
}
