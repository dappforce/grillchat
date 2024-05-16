import Stats from '@/assets/graphics/stats.svg'
import TopMemes from '@/assets/graphics/top-memes.svg'
import LinkText from '@/components/LinkText'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { useMemo } from 'react'

export type HomePageView = 'stats' | 'top-memes'

type MobileNavigationProps = {
  homePageView: HomePageView
  setHomePageView: (view: HomePageView) => void
}

const MobileNavigation = ({
  homePageView,
  setHomePageView,
}: MobileNavigationProps) => {
  const myAddress = useMyMainAddress()

  const tabs: { id: HomePageView; text: string; Icon: any }[] = useMemo(
    () => [
      {
        id: 'top-memes',
        text: 'Top Memes',
        Icon: TopMemes,
      },
      {
        id: 'stats',
        text: `${myAddress ? 'My ' : ''}Stats`,
        Icon: Stats,
      },
    ],
    [myAddress]
  )

  return (
    <div
      className={cx(
        'sticky bottom-0 w-full border-t border-slate-200 bg-white',
        'items-center- flex justify-around lg:hidden'
      )}
    >
      {tabs.map(({ id, text, Icon }) => (
        <TabButton
          key={id}
          onClick={() => setHomePageView(id)}
          className={cx(
            'flex h-full w-full flex-col items-center gap-2 !py-4 !text-slate-400 [&_path]:fill-slate-400',
            {
              ['!text-text-primary [&_path]:fill-text-primary']:
                homePageView === id,
            }
          )}
          label={
            <>
              <Icon className='h-[20px] w-[20px]' />
              <span className='text-sm leading-none'>{text}</span>
            </>
          }
        />
      ))}
    </div>
  )
}

type TabButtonProps = {
  onClick: () => void
  label: React.ReactNode
  className?: string
}

const TabButton = ({ onClick, label, className }: TabButtonProps) => {
  return (
    <LinkText
      onClick={onClick}
      variant={'primary'}
      className={cx('hover:no-underline', className)}
    >
      {label}
    </LinkText>
  )
}

export default MobileNavigation
