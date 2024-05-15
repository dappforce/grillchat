import Stats from '@/assets/graphics/stats.svg'
import TopMemes from '@/assets/graphics/top-memes.svg'
import LinkText from '@/components/LinkText'
import { cx } from '@/utils/class-names'

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

export type HomePageView = 'stats' | 'top-memes'

type MobileNavigationProps = {
  homePageView: HomePageView
  setHomePageView: (view: HomePageView) => void
}

const MobileNavigation = ({
  homePageView,
  setHomePageView,
}: MobileNavigationProps) => {
  return (
    <div
      className={cx(
        'sticky bottom-0 w-full border-t border-slate-200 bg-white p-4',
        'items-center- flex justify-around gap-4 lg:hidden'
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
              <Icon className='h-[20px] w-[20px]' />
              <span className='text-sm leading-none'>{text}</span>
            </div>
          }
        />
      ))}
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

export default MobileNavigation
