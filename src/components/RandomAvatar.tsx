import { cx } from '@/utils/class-names'
import * as bottts from '@dicebear/bottts'
import { createAvatar } from '@dicebear/core'
import Image from 'next/image'
import { useMemo } from 'react'

export default function RandomAvatar({
  value,
  className,
}: {
  value: string
  className?: string
}) {
  const avatar = useMemo(() => {
    return createAvatar(bottts, {
      size: 128,
      seed: value,
    }).toDataUriSync()
  }, [value])

  return (
    <div className={cx('relative h-full w-full p-[7.5%]', className)}>
      <div className='relative h-full w-full'>
        <Image
          sizes='5rem'
          className='relative rounded-full'
          fill
          src={avatar}
          alt='avatar'
        />
      </div>
    </div>
  )
}
