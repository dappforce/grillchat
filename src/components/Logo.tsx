import Grill from '@/assets/logo/grill.svg'
import GrillX from '@/assets/logo/grillx.svg'
import { getNetwork } from '@/utils/network'
import { ComponentProps } from 'react'

export type LogoProps = ComponentProps<'p'>

export default function Logo({ ...props }: LogoProps) {
  if (getNetwork() === 'xsocial') return <GrillX {...props} />
  return <Grill {...props} />
}
