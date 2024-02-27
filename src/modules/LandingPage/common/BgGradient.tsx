import BlueGreenGradient from '@/assets/graphics/landing/gradients/blue-green.png'
import BlueGradient from '@/assets/graphics/landing/gradients/blue.png'
import DarkBlueGradient from '@/assets/graphics/landing/gradients/dark-blue.png'
import GreenGradient from '@/assets/graphics/landing/gradients/green.png'
import PurpleGradient from '@/assets/graphics/landing/gradients/purple.png'
import PinkGradient from '@/assets/graphics/landing/gradients/pink.png'
import { cx } from '@/utils/class-names'
import Image, { StaticImageData } from 'next/image'
import { ComponentProps } from 'react'

const colors = ['blue', 'blue-green', 'dark-blue', 'green', 'purple', 'pink'] as const
const colorMapper: Record<(typeof colors)[number], StaticImageData> = {
  blue: BlueGradient,
  'blue-green': BlueGreenGradient,
  'dark-blue': DarkBlueGradient,
  green: GreenGradient,
  purple: PurpleGradient,
  pink: PurpleGradient,
}

export default function BgGradient({
  color,
  ...props
}: Omit<ComponentProps<'div'>, 'translate'> & {
  color: (typeof colors)[number]
}) {
  const src = colorMapper[color]
  if (!src) return null
  return (
    <div
      {...props}
      className={cx(
        'pointer-events-none relative rounded-full',
        props.className
      )}
    >
      <Image
        src={src}
        alt=''
        priority
        className='unselectable absolute inset-0 h-full w-full origin-center scale-[200%]'
      />
    </div>
  )
}
