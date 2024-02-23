import { cx, getBlurFallbackStyles } from '@/utils/class-names'
import { ComponentProps } from 'react'

export default function BgGradient(
  props: Omit<ComponentProps<'div'>, 'translate'> & {
    translate?: { x?: string; y?: string }
  }
) {
  return (
    <div
      className={cx('visible rounded-full blur-[225px]', props.className)}
      style={{ ...getBlurFallbackStyles({ translate: props.translate }) }}
    />
  )
}
