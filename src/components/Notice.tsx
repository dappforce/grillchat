import { cx } from '@/utils/class-names'
import { cva, VariantProps } from 'class-variance-authority'
import { ReactNode } from 'react'
import Card, { CardProps } from './Card'

const noticeStyles = cva('flex items-start gap-2', {
  variants: {
    noticeType: {
      success: cx('text-green-600 bg-green-600/10'),
      info: cx(
        'text-blue-600 bg-blue-500/10 dark:text-blue-400 dark:bg-blue-500/10'
      ),
      grey: cx('text-text-muted bg-background-lighter'),
    },
  },
  defaultVariants: {
    noticeType: 'success',
  },
})

export type NoticeProps = CardProps &
  VariantProps<typeof noticeStyles> & {
    leftIcon?: ReactNode
  }

export default function Notice({
  noticeType,
  leftIcon,
  ...props
}: NoticeProps) {
  return (
    <Card
      {...props}
      className={cx(noticeStyles({ noticeType }), props.className)}
    >
      {leftIcon && <span>{leftIcon}</span>}
      <div>{props.children}</div>
    </Card>
  )
}
