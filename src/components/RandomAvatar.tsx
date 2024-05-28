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
          height={500}
          width={500}
          className='relative h-full w-full rounded-full'
          src={avatar}
          alt='avatar'
        />
      </div>
    </div>
  )
}
