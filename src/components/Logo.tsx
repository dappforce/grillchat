import LogoSvg from '@/assets/logo/logo.svg'
import { ComponentProps } from 'react'

export type LogoProps = ComponentProps<'p'>

export default function Logo({ ...props }: LogoProps) {
  return <LogoSvg {...props} />
}
