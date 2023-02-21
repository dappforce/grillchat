import { cx } from '@/utils/className'
import localFont from '@next/font/local'
import { ComponentProps } from 'react'

const signPainter = localFont({ src: '../assets/fonts/SignPainter.ttf' })

export type LogoProps = ComponentProps<'p'>

export default function Logo({ ...props }: LogoProps) {
  return (
    <p
      {...props}
      className={cx(signPainter.className, 'relative top-1', props.className)}
    >
      GrillChat
    </p>
  )
}
