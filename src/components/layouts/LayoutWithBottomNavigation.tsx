import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import useLoginInTelegramMiniApps from '../navbar/Navbar/telegramLogin/useLoginInTelegramMiniApps'
import MobileNavigation from './MobileNavigation'

export type DefaultLayoutProps = ComponentProps<'div'> & {
  withFixedHeight?: boolean
  withFixedWidth?: boolean
}

export default function LayoutWithBottomNavigation({
  children,
  style,
  withFixedHeight,
  withFixedWidth,
  ...props
}: DefaultLayoutProps) {
  const logout = useMyAccount((state) => state.logout)
  useLoginInTelegramMiniApps()
  // const app = useMiniAppRaw(true)
  // const isMobile = isTouchDevice()
  // useRedirectToTgBotOnDesktop()

  // if (app?.result && !isMobile) {
  //   return <>Use mobile device for better expirience</>
  // }

  return (
    <div
      {...props}
      className={cx(
        'mx-auto flex max-w-screen-md flex-col bg-background text-text',
        withFixedHeight && 'h-screen',
        props.className
      )}
      style={
        withFixedHeight
          ? { height: '100dvh', ...style }
          : { minHeight: '100svh', ...style }
      }
    >
      {children}
      <MobileNavigation />
    </div>
  )
}
