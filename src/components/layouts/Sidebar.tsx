import Farcaster from '@/assets/logo/farcaster.svg'
import Galxe from '@/assets/logo/galxe.svg'
import useIsMounted from '@/hooks/useIsMounted'
import { cx } from '@/utils/class-names'
import { useRouter } from 'next/router'
import { IconType } from 'react-icons'
import { FaRegLaugh, FaRegLaughBeam } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { RiQuestionLine } from 'react-icons/ri'
import CustomLink from '../referral/CustomLink'

export default function Sidebar() {
  const isMounted = useIsMounted()

  if (!isMounted) return null

  return (
    <aside className='flex flex-col p-4 pl-0 text-[#64748BCC] dark:text-text-muted'>
      <ul className='flex flex-col gap-8'>
        <div className='flex flex-col gap-3'>
          <span className='text-xs'>MEME2EARN</span>
          <div className='flex flex-col gap-4'>
            <SidebarItem icon={FaRegLaughBeam} title='Epic Memes' href='/' />
            <SidebarItem icon={FaRegLaugh} title='Memes' href='/memes' />
          </div>
        </div>

        <div className='flex flex-col gap-3'>
          <span className='text-xs'>LEARN MORE</span>
          <div className='flex flex-col gap-4'>
            <SidebarItem icon={Galxe} title='Galxe Quests' href='/galxe' />
            <SidebarItem
              icon={RiQuestionLine}
              title='What is Epic?'
              href='/what-is-epic'
            />
          </div>
        </div>

        <div className='flex flex-col gap-3'>
          <span className='text-xs'>SOCIAL LINKS</span>
          <div className='flex flex-col gap-4'>
            <SidebarItem icon={Farcaster} title='Farcaster' href='/farcaster' />
            <SidebarItem icon={FaXTwitter} title='X' href='/x' />
          </div>
        </div>
      </ul>
    </aside>
  )
}

export const getLeaderboardLink = (address: string | null) =>
  `/leaderboard${address ? `/${address}` : ''}`

function SidebarItem({
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
    <li>
      <CustomLink
        className={cx(
          'flex items-center gap-4 transition hover:text-text-primary focus-visible:text-text-primary',
          pathname === href && !forceHardNavigation && 'text-text-primary'
        )}
        forceHardNavigation={forceHardNavigation}
        href={href}
      >
        <Icon className={cx('text-xl', iconClassName)} />
        <span className='text-sm font-medium'>{title}</span>
      </CustomLink>
    </li>
  )
}
