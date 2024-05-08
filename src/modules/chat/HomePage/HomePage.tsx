import Stats from '@/assets/graphics/stats.svg'
import TopMemes from '@/assets/graphics/top-memes.svg'
import Container from '@/components/Container'
import LinkText from '@/components/LinkText'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import useBreakpointThreshold from '@/hooks/useBreakpointThreshold'
import useIsMounted from '@/hooks/useIsMounted'
import { useState } from 'react'
import { cx } from '../../../utils/class-names'
import ChatContent, { MobileChatContent } from './ChatContent'
import MainContent from './epic-leaderboard/MainContent'

export type HomePageProps = {}

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DefaultLayout className='relative'>
      <MobileHomePageView />
      <Container className='grid flex-1 grid-cols-1 gap-4 px-4 max-lg:hidden lg:grid-cols-[1fr_325px] xl:grid-cols-[1fr_400px]'>
        <ChatContentRenderer isOpen={isOpen} setIsOpen={setIsOpen} />
        <MainContent />
      </Container>
    </DefaultLayout>
  )
}

type HomePageView = 'stats' | 'top-memes'

const tabs: { id: HomePageView; text: string; Icon: any }[] = [
  {
    id: 'top-memes',
    text: 'Top Memes',
    Icon: TopMemes,
  },
  {
    id: 'stats',
    text: 'Stats',
    Icon: Stats,
  },
]

const MobileHomePageView = () => {
  const [homePageView, setHomePageView] = useState<HomePageView>('stats')

  return (
    <div className='flex-[1_1_0] lg:hidden'>
      {homePageView === 'stats' ? <ChatContent hubId='' /> : <MainContent />}
      <div
        className={cx(
          'sticky bottom-0 w-full border-t border-slate-200 bg-white p-4',
          'items-center- flex justify-around gap-4'
        )}
      >
        {tabs.map(({ id, text, Icon }) => (
          <TabButton
            key={id}
            onClick={() => setHomePageView(id)}
            label={
              <div
                className={cx(
                  'flex flex-col items-center gap-2 !text-slate-400 [&_path]:fill-slate-400',
                  {
                    ['!text-text-primary [&_path]:fill-text-primary']:
                      homePageView === id,
                  }
                )}
              >
                <Icon className='w-[20px] h-[20px]' />
                <span className='leading-none text-sm'>{text}</span>
              </div>
            }
          />
        ))}
      </div>
    </div>
  )
}

type TabButtonProps = {
  onClick: () => void
  label: React.ReactNode
}

const TabButton = ({ onClick, label }: TabButtonProps) => {
  return (
    <LinkText
      onClick={onClick}
      variant={'primary'}
      className='hover:no-underline'
    >
      {label}
    </LinkText>
  )
}

function ChatContentRenderer({
  setIsOpen,
  isOpen,
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}) {
  const lgUp = useBreakpointThreshold('lg')
  const isMounted = useIsMounted()

  if (!isMounted) return null

  return (
    <>
      {lgUp ? (
        <ChatContent hubId='' />
      ) : (
        <MobileChatContent
          hubId=''
          isOpen={isOpen}
          close={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
