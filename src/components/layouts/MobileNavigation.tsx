import Airdrop from '@/assets/icons/bottomNavbar/airdrop.svg'
import Friends from '@/assets/icons/bottomNavbar/friends.svg'
import Tap from '@/assets/icons/bottomNavbar/tap.svg'
import Tasks from '@/assets/icons/bottomNavbar/tasks.svg'
import TopMemes from '@/assets/icons/bottomNavbar/top-memes.svg'
import { env } from '@/env.mjs'
import useIsMounted from '@/hooks/useIsMounted'
import { getPostQuery } from '@/services/api/query'
import { getPostMetadataQuery } from '@/services/datahub/posts/query'
import { getDayAndWeekTimestamp } from '@/services/datahub/utils'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import { LocalStorage } from '@/utils/storage'
import { useHapticFeedbackRaw } from '@tma.js/sdk-react'
import { useRouter } from 'next/router'
import { ComponentProps } from 'react'
import { IconType } from 'react-icons'
import CustomLink from 'src/components/referral/CustomLink'
import useLastReadTimeFromStorage from '../chats/hooks/useLastReadMessageTimeFromStorage'

const tasksPageVisitedDateStore = new LocalStorage(
  () => 'tasks-page-visited-date'
)

export type HomePageView = 'memes' | 'tasks' | 'airdrop' | 'friends' | 'tap'

type MobileNavigationProps = {}

type Tab = {
  id: HomePageView
  text: string
  Icon: any
  href: string
  customClassName?: string
  onClick?: () => void
}

const tabs: Tab[] = [
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
    href: '/tg/tap',
  },
  {
    id: 'memes',
    text: 'Memes',
    Icon: (props: ComponentProps<'div'>) => (
      <div {...props} className={cx('relative', props.className)}>
        <TopMemes />
        <NewMemeNotice />
      </div>
    ),
    href: '/tg',
  },
  {
    id: 'tasks',
    text: 'Tasks',
    Icon: (props: ComponentProps<'div'>) => (
      <div {...props} className={cx('relative', props.className)}>
        <Tasks />
        <TasksPageDot />
      </div>
    ),
    href: '/tg/tasks',
    onClick: () => {
      const { day } = getDayAndWeekTimestamp()
      const tasksPageVisitedDate = tasksPageVisitedDateStore.get() as string

      if (tasksPageVisitedDate !== day.toString()) {
        tasksPageVisitedDateStore.set(day.toString())
      }
    },
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
        {tabs.map(({ id, text, Icon, href, customClassName, onClick }) => (
          <NavigationItem
            key={id}
            href={href}
            icon={Icon}
            title={text}
            id={id}
            className={customClassName}
            onClick={onClick}
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
  onClick,
}: {
  icon: IconType
  title: string
  href: string
  forceHardNavigation?: boolean
  iconClassName?: string
  className?: string
  id: string
  onClick?: () => void
}) {
  const { pathname } = useRouter()
  const sendEvent = useSendEvent()
  const haptic = useHapticFeedbackRaw(true)

  const onButtonClick = () => {
    sendEvent('navbar_clicked', { value: id })
    haptic?.result?.impactOccurred('medium')

    onClick?.()
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
      // Need to do this so that the page won't scroll back to top which is an issue with useTgNoScroll
      href={pathname === href ? undefined : href}
      shallow
      onClick={onButtonClick}
    >
      <Icon className={cx('text-xl', iconClassName)} />
      <span className='text-sm font-medium leading-none'>{title}</span>
    </CustomLink>
  )
}

const TasksPageDot = () => {
  const tasksPageVisitedDate = tasksPageVisitedDateStore.get() as string
  const { day } = getDayAndWeekTimestamp()

  if (tasksPageVisitedDate === day.toString()) return null

  return <RedDot />
}

function NewMemeNotice() {
  const { pathname } = useRouter()
  const { data: postMetadata } = getPostMetadataQuery.useQuery(
    env.NEXT_PUBLIC_MAIN_CHAT_ID
  )
  const { data: lastMessage } = getPostQuery.useQuery(
    postMetadata?.lastCommentId ?? '',
    {
      enabled: !!postMetadata?.lastCommentId,
    }
  )
  const { getLastReadTime } = useLastReadTimeFromStorage(
    env.NEXT_PUBLIC_MAIN_CHAT_ID
  )

  const isMounted = useIsMounted()

  if (
    pathname !== '/tg' &&
    isMounted &&
    lastMessage &&
    getLastReadTime() < lastMessage.struct.createdAtTime
  ) {
    return <RedDot />
  }
  return null
}

const RedDot = () => (
  <div className='absolute right-0 top-0 h-2 w-2 translate-x-[150%] rounded-full bg-red-500' />
)

export default MobileNavigation
