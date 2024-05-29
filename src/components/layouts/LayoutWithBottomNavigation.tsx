import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
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
  return (
    <div
      {...props}
      className={cx(
        'flex flex-col bg-background text-text',
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
