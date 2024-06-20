import Diamond from '@/assets/emojis/diamond.png'
import Calendar from '@/assets/graphics/tasks/calendar.png'
import Like from '@/assets/graphics/tasks/like.png'
import Telegram from '@/assets/graphics/tasks/telegram.png'
import TwitterX from '@/assets/graphics/tasks/twitter-x.png'
import Check from '@/assets/icons/check.svg'
import Card from '@/components/Card'
import LayoutWithBottomNavigation from '@/components/layouts/LayoutWithBottomNavigation'
import useTgNoScroll from '@/hooks/useTgNoScroll'
import PointsWidget from '@/modules/points/PointsWidget'
import { formatNumber } from '@/utils/strings'
import Image, { ImageProps } from 'next/image'
import { FaChevronRight } from 'react-icons/fa6'

export default function TasksPage() {
  useTgNoScroll()

  return (
    <LayoutWithBottomNavigation className='relative' withFixedHeight>
      <PointsWidget
        isNoTgScroll
        withPointsAnimation={false}
        className='sticky top-0'
      />
      <div className='flex flex-1 flex-col gap-8 overflow-auto px-4 py-8'>
        <DailyTasks />
        <BasicTasks />
        <NewTasks />
      </div>
    </LayoutWithBottomNavigation>
  )
}

function DailyTasks() {
  return (
    <div className='flex flex-col gap-5'>
      <span className='self-center text-lg font-bold text-text-muted'>
        Daily
      </span>
      <div className='flex flex-col gap-2'>
        <TaskCard
          image={Calendar}
          title='Check in'
          reward={5000}
          completed={false}
        />
        <TaskCard
          image={Like}
          title='Like 10 memes'
          reward={5000}
          completed={false}
          customAction={<span className='font-bold'>5/10</span>}
        />
      </div>
    </div>
  )
}

function BasicTasks() {
  return (
    <div className='flex flex-col gap-5'>
      <span className='self-center text-lg font-bold text-text-muted'>
        Basic Tasks
      </span>
      <div className='flex flex-col gap-2'>
        <TaskCard
          image={Telegram}
          title='Join Our Telegram Channel'
          reward={30000}
          completed={false}
        />
        <TaskCard
          image={TwitterX}
          title='Join Our Twitter'
          reward={30000}
          completed={false}
        />
      </div>
    </div>
  )
}

function TaskCard({
  completed,
  image,
  reward,
  title,
  customAction,
}: {
  image: ImageProps['src']
  title: string
  reward: number
  completed: boolean
  customAction?: React.ReactNode
}) {
  return (
    <Card className='flex items-center gap-2.5 bg-background-light p-2.5'>
      <Image src={image} alt='' className='h-14 w-14' />
      <div className='flex flex-col gap-1'>
        <span className='font-bold'>{title}</span>
        <div className='flex items-center gap-0.5'>
          <Image src={Diamond} alt='' className='relative top-px h-5 w-5' />
          <span className='text-text-muted'>+{formatNumber(reward)}</span>
        </div>
      </div>
      <div className='ml-auto flex items-center justify-center pr-1'>
        {customAction ? (
          customAction
        ) : completed ? (
          <Check />
        ) : (
          <FaChevronRight className='text-text-muted' />
        )}
      </div>
    </Card>
  )
}

function NewTasks() {
  return (
    <div className='flex flex-col items-center justify-center gap-2 py-8 text-center'>
      <span className='font-bold'>🕔 New Tasks Soon!</span>
      <span className='text-sm font-medium text-text-muted'>
        Don’t miss them
      </span>
    </div>
  )
}
