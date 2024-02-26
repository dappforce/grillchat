import { cx, getBlurFallbackStyles } from '@/utils/class-names'
import { ComponentProps } from 'react'

export default function BgGradient({
  color,
  translate,
  ...props
}: Omit<ComponentProps<'div'>, 'translate'> & {
  translate?: { x?: string; y?: string }
  color: string
}) {
  return (
    <div
      {...props}
      className={cx('visible rounded-full blur-[150px]', props.className)}
      style={{
        ...getBlurFallbackStyles({ translate }),
        background: `radial-gradient(${color}, transparent)`,
      }}
    />
  )
}
