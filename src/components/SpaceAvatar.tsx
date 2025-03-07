import { cx } from '@/utils/class-names'
import { SpaceData } from '@subsocial/api/types'
import Image from 'next/image'
import AddressAvatar from './AddressAvatar'

type SpaceAvatarProps = {
  space: SpaceData
  imageSize?: number
  className?: string
}

const SpaceAvatar = ({
  space,
  imageSize = 48,
  className,
}: SpaceAvatarProps) => {
  const image = space.content?.image

  return (
    <div>
      {image ? (
        <Image
          src={image}
          alt='Space avatar'
          width={imageSize}
          height={imageSize}
          className='rounded-full'
        />
      ) : (
        <AddressAvatar
          address={space.struct.ownerId}
          className={cx('h-[62px] w-[62px]', className)}
        />
      )}
    </div>
  )
}

export default SpaceAvatar
